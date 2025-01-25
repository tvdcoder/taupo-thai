-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "preparationTime" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending_confirmation';
