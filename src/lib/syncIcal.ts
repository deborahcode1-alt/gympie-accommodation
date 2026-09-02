import { prisma } from "@/lib/prisma";
import { fetchImportedBlocks } from "@/lib/ical";

export async function syncListingImports(listingId: string) {
  const imports = await prisma.icalImportUrl.findMany({ where: { listingId } });
  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const imp of imports) {
    try {
      const blocks = await fetchImportedBlocks(imp.url);
      const uniqueDates = [...new Set(blocks.map((b) => b.date.toISOString()))];

      await prisma.$transaction([
        prisma.blockedDate.deleteMany({ where: { listingId, source: "airbnb" } }),
        prisma.blockedDate.createMany({
          data: uniqueDates.map((iso) => ({
            listingId,
            date: new Date(iso),
            source: "airbnb",
            reason: imp.label,
          })),
        }),
        prisma.icalImportUrl.update({
          where: { id: imp.id },
          data: { lastSyncedAt: new Date(), lastError: null },
        }),
      ]);

      results.push({ id: imp.id, ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await prisma.icalImportUrl.update({
        where: { id: imp.id },
        data: { lastError: message },
      });
      results.push({ id: imp.id, ok: false, error: message });
    }
  }

  return results;
}

export async function syncAllImports() {
  const listings = await prisma.listing.findMany({ select: { id: true } });
  for (const l of listings) {
    await syncListingImports(l.id);
  }
}
