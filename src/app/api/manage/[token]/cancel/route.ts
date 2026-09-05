import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyGuestCancelled } from "@/lib/notifications";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const existing = await prisma.booking.findUnique({ where: { manageToken: token } });
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (existing.status === "CANCELLED" || existing.status === "DECLINED") {
    return NextResponse.json({ error: "This booking is already inactive" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { manageToken: token },
    data: { status: "CANCELLED" },
    include: { listing: { select: { id: true, name: true, hostId: true } } },
  });

  await notifyGuestCancelled(booking);

  return NextResponse.json({ booking });
}
