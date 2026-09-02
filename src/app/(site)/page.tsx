import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{SITE_TAGLINE}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-black/60 dark:text-white/60">
          Check real-time availability and request your stay directly &mdash; the same calendar
          we keep in sync with Airbnb.
        </p>
      </section>

      <section id="listings" className="mx-auto max-w-5xl px-6 pb-20">
        {listings.length === 0 ? (
          <p className="text-center text-black/60 dark:text-white/60">
            No listings published yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                slug={l.slug}
                name={l.name}
                tagline={l.tagline}
                basePrice={l.basePrice}
                maxGuests={l.maxGuests}
                bedrooms={l.bedrooms}
                coverPhoto={l.photos[0]?.url ?? null}
              />
            ))}
          </div>
        )}
      </section>

      <section id="contact" className="border-t border-black/10 py-16 dark:border-white/10">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold">Questions before you book?</h2>
          <p className="mt-2 text-black/60 dark:text-white/60">
            Open any listing below and send a request &mdash; the host reviews every booking
            personally.
          </p>
        </div>
      </section>
    </div>
  );
}
