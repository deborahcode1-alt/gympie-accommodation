import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUnavailableNights } from "@/lib/availability";
import { PhotoGallery } from "@/components/PhotoGallery";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { stayTypeLabel } from "@/lib/stayType";
import { DEFAULT_CANCELLATION_POLICY } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: { name: true, tagline: true, description: true, published: true },
  });
  if (!listing || !listing.published) return {};

  const description = listing.tagline || listing.description.slice(0, 155);
  return {
    title: listing.name,
    description,
    openGraph: { title: listing.name, description },
  };
}

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
  const policy = listing.cancellationPolicy || DEFAULT_CANCELLATION_POLICY;
  const policyParagraphs = policy.split("\n\n").filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <span className="inline-block rounded-full bg-header-bg px-2.5 py-1 text-xs font-medium text-header-fg">
        {stayTypeLabel(listing.stayType)}
      </span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{listing.name}</h1>
      {listing.tagline && <p className="mt-1 text-muted">{listing.tagline}</p>}
      {listing.address && <p className="mt-1 text-sm text-muted">{listing.address}</p>}

      <div className="mt-6">
        <PhotoGallery photos={listing.photos} name={listing.name} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-4 border-b border-card-border pb-6 text-sm">
            <span>{listing.maxGuests} guests</span>
            <span>&middot;</span>
            <span>{listing.bedrooms} bedrooms</span>
            <span>&middot;</span>
            <span>{listing.beds} beds</span>
            <span>&middot;</span>
            <span>{listing.baths} baths</span>
          </div>

          <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line">
            {listing.description}
          </div>

          {amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
                {amenities.map((a) => (
                  <li key={a}>&bull; {a}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Terms &amp; conditions</h2>
            <div className="mt-3 space-y-2 text-sm text-muted">
              {policyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div>
          <AvailabilityCalendar
            slug={listing.slug}
            basePrice={listing.basePrice}
            cleaningFee={listing.cleaningFee}
            minNights={listing.minNights}
            maxGuests={listing.maxGuests}
            unavailableNights={[...unavailableSet]}
          />
        </div>
      </div>

      <div className="mt-12 border-t border-card-border pt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-md border border-card-border px-5 py-2.5 text-sm font-medium transition hover:bg-foreground/5"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
