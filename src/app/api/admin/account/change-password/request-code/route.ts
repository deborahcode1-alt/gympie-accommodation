import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { generateCode, hashCode, CODE_TTL_MS } from "@/lib/verificationCode";

const schema = z.object({ currentPassword: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email: session.email } });
  if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Email isn't set up yet, so a verification code can't be sent." },
      { status: 400 }
    );
  }

  const code = generateCode();
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      pendingCodeHash: hashCode(code),
      pendingCodeExpiresAt: new Date(Date.now() + CODE_TTL_MS),
      pendingCodeAttempts: 0,
    },
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Your verification code",
      text: `Your verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send verification email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
