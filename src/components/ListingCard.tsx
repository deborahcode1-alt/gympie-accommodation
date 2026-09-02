import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";

type Props = {
  slug: string;
  name: string;
  tagline: string | null;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  coverPhoto: string | null;
};

export function ListingCard({ slug, name, tagline, basePrice, maxGuests, bedrooms, coverPhoto }: Props) {
  return (
    <Link
      href={`/listings/${slug}`}
      className="group block overflow-hidden rounded-xl border border-black/10 transition hover:shadow-md dark:border-white/15"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 dark:bg-white/5">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/40 dark:text-white/40">
            No photo yet
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        {tagline && <p className="mt-1 text-sm text-black/60 dark:text-white/60">{tagline}</p>}
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Up to {maxGuests} guests &middot; {bedrooms} bedroom{bedrooms === 1 ? "" : "s"}
        </p>
        <p className="mt-2 text-sm font-medium">{formatMoney(basePrice)} / night</p>
      </div>
    </Link>
  );
}
