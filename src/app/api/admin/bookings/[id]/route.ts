import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ booking });
}
