import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUnavailableNights } from "@/lib/availability";
import { ManageBookingClient } from "@/components/ManageBookingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage your booking",
  robots: { index: false, follow: false },
};

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { manageToken: token },
    include: { listing: true },
  });
  if (!booking) notFound();

  const unavailableSet = await getUnavailableNights(booking.listing.id, booking.id);

  return (
    <ManageBookingClient
      token={token}
      status={booking.status}
      listingName={booking.listing.name}
      listingSlug={booking.listing.slug}
      checkIn={booking.checkIn.toISOString()}
      checkOut={booking.checkOut.toISOString()}
      guests={booking.guests}
      totalPrice={booking.totalPrice}
      basePrice={booking.listing.basePrice}
      cleaningFee={booking.listing.cleaningFee}
      minNights={booking.listing.minNights}
      unavailableNights={[...unavailableSet]}
    />
  );
}
