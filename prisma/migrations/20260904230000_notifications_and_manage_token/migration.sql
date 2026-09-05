-- AlterTable: Host notification contact fields
ALTER TABLE "Host" ADD COLUMN "notificationEmail" TEXT;
ALTER TABLE "Host" ADD COLUMN "notificationPhone" TEXT;

-- AlterTable: Booking.manageToken, added nullable first to backfill existing rows
ALTER TABLE "Booking" ADD COLUMN "manageToken" TEXT;

-- Backfill existing bookings with a unique token
UPDATE "Booking" SET "manageToken" = md5(random()::text || clock_timestamp()::text || id)
WHERE "manageToken" IS NULL;

-- Now make it required and unique
ALTER TABLE "Booking" ALTER COLUMN "manageToken" SET NOT NULL;
CREATE UNIQUE INDEX "Booking_manageToken_key" ON "Booking"("manageToken");
