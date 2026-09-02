import ical, { ICalCalendarMethod } from "ical-generator";
import * as nodeIcal from "node-ical";
import { toDateOnly } from "@/lib/availability";

type FeedBooking = { id: string; checkIn: Date; checkOut: Date; guestName: string };
type FeedBlock = { id: string; date: Date };

export function buildIcalFeed(params: {
  listingName: string;
  bookings: FeedBooking[];
  blockedDates: FeedBlock[];
}) {
  const cal = ical({ name: `${params.listingName} availability` });
  cal.method(ICalCalendarMethod.PUBLISH);

  for (const b of params.bookings) {
    cal.createEvent({
      id: `booking-${b.id}`,
      start: toDateOnly(b.checkIn),
      end: toDateOnly(b.checkOut),
      allDay: true,
      summary: "Reserved",
      description: `Booked via direct site (${b.guestName})`,
    });
  }

  // Collapse manual blocked single-day entries into events too.
  for (const bl of params.blockedDates) {
    const start = toDateOnly(bl.date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    cal.createEvent({
      id: `blocked-${bl.id}`,
      start,
      end,
      allDay: true,
      summary: "Unavailable",
    });
  }

  return cal.toString();
}

export type ImportedBlock = { date: Date };

// node-ical parses all-day `DTSTART;VALUE=DATE` fields into a Date built from local
// calendar-date components (e.g. local midnight), not UTC — so recovering the intended
// calendar day must read local getters, then re-anchor to our UTC-midnight storage
// convention. Using UTC getters here would shift every date by a day on any server whose
// local timezone isn't UTC+0.
function localDateToUTCDateOnly(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export async function fetchImportedBlocks(url: string): Promise<ImportedBlock[]> {
  const data = await nodeIcal.async.fromURL(url);
  const blocks: ImportedBlock[] = [];

  for (const key of Object.keys(data)) {
    const event = data[key];
    if (!event || event.type !== "VEVENT") continue;
    const vevent = event as unknown as { start?: Date; end?: Date };
    if (!vevent.start || !vevent.end) continue;

    const cursor = localDateToUTCDateOnly(vevent.start);
    const end = localDateToUTCDateOnly(vevent.end);
    while (cursor < end) {
      blocks.push({ date: new Date(cursor) });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  return blocks;
}
