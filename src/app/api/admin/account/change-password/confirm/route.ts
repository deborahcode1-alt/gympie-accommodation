import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashCode, MAX_CODE_ATTEMPTS } from "@/lib/verificationCode";

const schema = z.object({
  code: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email: session.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.pendingCodeHash || !user.pendingCodeExpiresAt) {
    return NextResponse.json(
      { error: "No verification code was requested. Request a new one first." },
      { status: 400 }
    );
  }

  if (user.pendingCodeExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "That code has expired. Request a new one." },
      { status: 400 }
    );
  }

  if (user.pendingCodeAttempts >= MAX_CODE_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many incorrect attempts. Request a new code." },
      { status: 429 }
    );
  }

  if (hashCode(parsed.data.code) !== user.pendingCodeHash) {
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { pendingCodeAttempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "That code is incorrect" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      passwordHash,
      pendingCodeHash: null,
      pendingCodeExpiresAt: null,
      pendingCodeAttempts: 0,
    },
  });

  return NextResponse.json({ ok: true });
}
