import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/admin/ListingForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { DeleteListingButton } from "@/components/admin/DeleteListingButton";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!listing) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{listing.name}</h1>
          <Link
            href={`/listings/${listing.slug}`}
            target="_blank"
            className="text-sm text-black/50 hover:underline dark:text-white/50"
          >
            View public page &rarr;
          </Link>
        </div>
        <Link
          href={`/admin/listings/${listing.id}/calendar`}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
        >
          Calendar &amp; Airbnb sync
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Photos</h2>
        <div className="mt-3">
          <PhotoManager listingId={listing.id} photos={listing.photos} />
        </div>
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-lg font-semibold">Details</h2>
        <div className="mt-3">
          <ListingForm
            initial={{
              id: listing.id,
              name: listing.name,
              tagline: listing.tagline ?? "",
              description: listing.description,
              address: listing.address ?? "",
              maxGuests: listing.maxGuests,
              bedrooms: listing.bedrooms,
              beds: listing.beds,
              baths: listing.baths,
              basePrice: listing.basePrice,
              cleaningFee: listing.cleaningFee,
              minNights: listing.minNights,
              amenities: JSON.parse(listing.amenities || "[]"),
              published: listing.published,
            }}
          />
        </div>
      </section>

      <div className="mt-10 border-t border-black/10 pt-6 dark:border-white/10">
        <DeleteListingButton listingId={listing.id} name={listing.name} />
      </div>
    </div>
  );
}
