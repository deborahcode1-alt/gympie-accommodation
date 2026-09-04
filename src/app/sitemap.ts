import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gympie-accommodation.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...listings.map((l) => ({
      url: `${SITE_URL}/listings/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
