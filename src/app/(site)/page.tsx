import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { published: true },
    orderBy: { basePrice: "asc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div>
      <section className="relative h-[65vh] min-h-[460px] overflow-hidden">
        <Image
          src="/hero-empire.png"
          alt="The Empire, a heritage guesthouse in Gympie"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-10 sm:justify-start sm:pl-10">
          <div className="max-w-lg rounded-sm bg-header-bg/90 px-8 py-7 text-center text-header-fg shadow-lg backdrop-blur-sm sm:text-left">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{SITE_TAGLINE}</h1>
            <p className="mt-3 text-sm text-header-fg/80">
              Check real-time availability and book direct &mdash; from budget rooms to whole
              houses, all in one place.
            </p>
          </div>
        </div>
      </section>

      <section id="listings" className="mx-auto max-w-5xl px-6 py-16">
        {listings.length === 0 ? (
          <p className="text-center text-muted">No listings published yet. Check back soon.</p>
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
                stayType={l.stayType}
                coverPhoto={l.photos[0]?.url ?? null}
              />
            ))}
          </div>
        )}
      </section>

      <section id="contact" className="border-t border-card-border py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold">Questions before you book?</h2>
          <p className="mt-2 text-muted">
            Open any listing below and send a request &mdash; the host reviews every booking
            personally.
          </p>
        </div>
      </section>
    </div>
  );
}
