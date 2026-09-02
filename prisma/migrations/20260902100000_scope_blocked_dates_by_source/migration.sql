-- DropIndex
DROP INDEX "BlockedDate_listingId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_listingId_date_source_key" ON "BlockedDate"("listingId", "date", "source");
