import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/BookingForm";
import { DEFAULT_CANCELLATION_POLICY } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book your stay",
  robots: { index: false, follow: false },
};

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const listing = await prisma.listing.findUnique({ where: { slug } });
  if (!listing || !listing.published) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Book {listing.name}</h1>
      <p className="mt-1 text-sm text-muted">
        This sends a request to the host &mdash; it isn&apos;t confirmed until they accept.
      </p>

      <div className="mt-8">
        <BookingForm
          listingId={listing.id}
          listingName={listing.name}
          basePrice={listing.basePrice}
          cleaningFee={listing.cleaningFee}
          minNights={listing.minNights}
          maxGuests={listing.maxGuests}
          cancellationPolicy={listing.cancellationPolicy || DEFAULT_CANCELLATION_POLICY}
          initialCheckIn={query.checkIn || ""}
          initialCheckOut={query.checkOut || ""}
          initialGuests={query.guests ? Number(query.guests) : 1}
        />
      </div>
    </div>
  );
}
