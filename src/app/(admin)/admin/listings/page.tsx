import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listings</h1>
        <Link
          href="/admin/listings/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          New listing
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {listings.map((l) => (
          <Link
            key={l.id}
            href={`/admin/listings/${l.id}`}
            className="flex items-center justify-between rounded-lg border border-black/10 p-4 hover:bg-black/[.02] dark:border-white/10 dark:hover:bg-white/[.02]"
          >
            <div>
              <p className="font-medium">
                {l.name} {!l.published && <span className="text-xs text-black/40">(draft)</span>}
              </p>
              <p className="text-sm text-black/50 dark:text-white/50">
                {formatMoney(l.basePrice)}/night &middot; {l._count.bookings} booking(s)
              </p>
            </div>
            <span className="text-sm text-black/40">Manage &rarr;</span>
          </Link>
        ))}
        {listings.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">
            No listings yet. Create your first one to start taking bookings.
          </p>
        )}
      </div>
    </div>
  );
}
