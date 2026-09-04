import { prisma } from "@/lib/prisma";
import { BookingsTable } from "@/components/admin/BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [pending, upcoming, listingCount] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { listing: { select: { name: true } } },
    }),
    prisma.booking.count({
      where: { status: "CONFIRMED", checkOut: { gte: new Date() } },
    }),
    prisma.listing.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-card-border p-4">
          <p className="text-xs uppercase text-muted">Pending requests</p>
          <p className="mt-1 text-2xl font-semibold">{pending.length}</p>
        </div>
        <div className="rounded-lg border border-card-border p-4">
          <p className="text-xs uppercase text-muted">Upcoming stays</p>
          <p className="mt-1 text-2xl font-semibold">{upcoming}</p>
        </div>
        <div className="rounded-lg border border-card-border p-4">
          <p className="text-xs uppercase text-muted">Listings</p>
          <p className="mt-1 text-2xl font-semibold">{listingCount}</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Needs your response</h2>
      <div className="mt-3">
        <BookingsTable bookings={pending} />
      </div>
    </div>
  );
}
