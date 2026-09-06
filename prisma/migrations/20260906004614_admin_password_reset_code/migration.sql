-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "pendingCodeAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pendingCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "pendingCodeHash" TEXT;
