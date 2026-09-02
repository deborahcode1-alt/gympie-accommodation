-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "maxGuests" INTEGER NOT NULL DEFAULT 2,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "beds" INTEGER NOT NULL DEFAULT 1,
    "baths" REAL NOT NULL DEFAULT 1,
    "basePrice" REAL NOT NULL,
    "cleaningFee" REAL NOT NULL DEFAULT 0,
    "minNights" INTEGER NOT NULL DEFAULT 1,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "icalExportToken" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalPrice" REAL NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "reason" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    CONSTRAINT "BlockedDate_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IcalImportUrl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Airbnb',
    "lastSyncedAt" DATETIME,
    "lastError" TEXT,
    CONSTRAINT "IcalImportUrl_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_icalExportToken_key" ON "Listing"("icalExportToken");

-- CreateIndex
CREATE INDEX "Booking_listingId_checkIn_checkOut_idx" ON "Booking"("listingId", "checkIn", "checkOut");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_listingId_date_key" ON "BlockedDate"("listingId", "date");
