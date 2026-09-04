-- CreateEnum
CREATE TYPE "StayType" AS ENUM ('SHORT_TERM', 'LONG_TERM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "squarePaymentId" TEXT;

-- AlterTable
ALTER TABLE "IcalImportUrl" ALTER COLUMN "label" SET DEFAULT 'Calendar';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "hostId" TEXT,
ADD COLUMN     "stayType" "StayType" NOT NULL DEFAULT 'SHORT_TERM';

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "squareAccessToken" TEXT,
    "squareLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE SET NULL ON UPDATE CASCADE;
