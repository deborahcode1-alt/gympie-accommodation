import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BookingActions } from "@/components/admin/BookingActions";

type Row = {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: string;
  listing: { name: string };
};

export function BookingsTable({ bookings }: { bookings: Row[] }) {
  if (bookings.length === 0) {
    return <p className="text-sm text-black/60 dark:text-white/60">No bookings here yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/[.03] text-xs uppercase tracking-wide text-black/50 dark:bg-white/[.03] dark:text-white/50">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Listing</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-black/10 dark:border-white/10">
              <td className="px-4 py-3">
                <div className="font-medium">{b.guestName}</div>
                <div className="text-xs text-black/50 dark:text-white/50">{b.guestEmail}</div>
              </td>
              <td className="px-4 py-3">{b.listing.name}</td>
              <td className="px-4 py-3">
                {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
              </td>
              <td className="px-4 py-3">{b.guests}</td>
              <td className="px-4 py-3">{formatMoney(b.totalPrice)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={b.status} />
              </td>
              <td className="px-4 py-3">
                <BookingActions bookingId={b.id} status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
