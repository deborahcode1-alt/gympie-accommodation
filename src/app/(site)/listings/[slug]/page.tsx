import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUnavailableNights } from "@/lib/availability";
import { PhotoGallery } from "@/components/PhotoGallery";
import { BookingWidget } from "@/components/BookingWidget";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!listing || !listing.published) notFound();

  const unavailableSet = await getUnavailableNights(listing.id);
  const amenities: string[] = JSON.parse(listing.amenities || "[]");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{listing.name}</h1>
      {listing.tagline && (
        <p className="mt-1 text-black/60 dark:text-white/60">{listing.tagline}</p>
      )}
      {listing.address && (
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">{listing.address}</p>
      )}

      <div className="mt-6">
        <PhotoGallery photos={listing.photos} name={listing.name} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-4 border-b border-black/10 pb-6 text-sm dark:border-white/10">
            <span>{listing.maxGuests} guests</span>
            <span>&middot;</span>
            <span>{listing.bedrooms} bedrooms</span>
            <span>&middot;</span>
            <span>{listing.beds} beds</span>
            <span>&middot;</span>
            <span>{listing.baths} baths</span>
          </div>

          <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line dark:prose-invert">
            {listing.description}
          </div>

          {amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/70 dark:text-white/70">
                {amenities.map((a) => (
                  <li key={a}>&bull; {a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <BookingWidget
            listingId={listing.id}
            basePrice={listing.basePrice}
            cleaningFee={listing.cleaningFee}
            minNights={listing.minNights}
            maxGuests={listing.maxGuests}
            unavailableNights={[...unavailableSet]}
          />
        </div>
      </div>
    </div>
  );
}
