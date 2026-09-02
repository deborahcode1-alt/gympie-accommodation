import { prisma } from "@/lib/prisma";
import { BookingsTable } from "@/components/admin/BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { checkIn: "desc" },
    include: { listing: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">All bookings</h1>
      <div className="mt-4">
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
