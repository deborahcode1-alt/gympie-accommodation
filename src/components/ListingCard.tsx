import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { stayTypeLabel, type StayType } from "@/lib/stayType";

type Props = {
  slug: string;
  name: string;
  tagline: string | null;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  stayType: StayType;
  coverPhoto: string | null;
};

export function ListingCard({
  slug,
  name,
  tagline,
  basePrice,
  maxGuests,
  bedrooms,
  stayType,
  coverPhoto,
}: Props) {
  return (
    <Link
      href={`/listings/${slug}`}
      className="group block overflow-hidden rounded-sm border border-card-border bg-background transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No photo yet
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-header-bg/90 px-2.5 py-1 text-xs font-medium text-header-fg">
          {stayTypeLabel(stayType)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        {tagline && <p className="mt-1 text-sm text-muted">{tagline}</p>}
        <p className="mt-2 text-sm text-muted">
          Up to {maxGuests} guests &middot; {bedrooms} bedroom{bedrooms === 1 ? "" : "s"}
        </p>
        <p className="mt-2 text-sm font-medium text-accent-deep">{formatMoney(basePrice)} / night</p>
      </div>
    </Link>
  );
}
