import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slugify";

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash },
    update: { passwordHash },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  const existing = await prisma.listing.findFirst();
  if (existing) {
    console.log("A listing already exists, skipping sample listing.");
    return;
  }

  const name = "The Riverside Cottage";
  const listing = await prisma.listing.create({
    data: {
      name,
      slug: slugify(name),
      tagline: "A cozy two-bedroom retreat steps from the water",
      description:
        "Wake up to river views in this bright, freshly renovated cottage. Walk to cafes and " +
        "trails, or unwind on the private deck with a coffee. Perfect for couples or small " +
        "families looking for a quiet getaway close to town.",
      address: "123 River Rd, Riverside",
      maxGuests: 4,
      bedrooms: 2,
      beds: 3,
      baths: 1.5,
      basePrice: 145,
      cleaningFee: 60,
      minNights: 2,
      amenities: JSON.stringify([
        "Wifi",
        "Full kitchen",
        "Free parking",
        "Washer & dryer",
        "Private deck",
        "River view",
        "Pet friendly",
        "Self check-in",
      ]),
      published: true,
      photos: {
        create: [
          { url: "https://picsum.photos/id/1040/1200/900", alt: "Cottage exterior", order: 0 },
          { url: "https://picsum.photos/id/1080/1200/900", alt: "Living room", order: 1 },
          { url: "https://picsum.photos/id/1060/1200/900", alt: "Bedroom", order: 2 },
          { url: "https://picsum.photos/id/1050/1200/900", alt: "River view deck", order: 3 },
        ],
      },
    },
  });
  console.log(`Sample listing created: ${listing.name} (/listings/${listing.slug})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  });
