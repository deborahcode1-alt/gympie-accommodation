import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { IcalImportManager } from "@/components/admin/IcalImportManager";
import { BlockedDatesManager } from "@/components/admin/BlockedDatesManager";
import { CopyableUrl } from "@/components/admin/CopyableUrl";

export default async function ListingCalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { blockedDates: true, icalImports: true },
  });
  if (!listing) notFound();

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const exportUrl = `${protocol}://${host}/api/ical/${listing.icalExportToken}.ics`;

  return (
    <div>
      <h1 className="text-2xl font-semibold">{listing.name} &mdash; Calendar &amp; sync</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Export to Airbnb</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Paste this URL into Airbnb (Calendar &rarr; Availability settings &rarr; Import
          calendar) so direct bookings and manual blocks show up as unavailable on Airbnb.
        </p>
        <div className="mt-3">
          <CopyableUrl url={exportUrl} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Import from Airbnb</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Connect your Airbnb export calendar so bookings made on Airbnb block those dates here
          too.
        </p>
        <div className="mt-3">
          <IcalImportManager listingId={listing.id} imports={listing.icalImports} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Blocked dates</h2>
        <div className="mt-3">
          <BlockedDatesManager listingId={listing.id} blocked={listing.blockedDates} />
        </div>
      </section>
    </div>
  );
}
