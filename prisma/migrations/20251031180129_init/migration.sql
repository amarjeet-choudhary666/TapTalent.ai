/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "createdAt",
ADD COLUMN     "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Average" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "averageBuyPrice" DOUBLE PRECISION NOT NULL,
    "averageSellPrice" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Average_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slippage" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "buyPriceSlippage" DOUBLE PRECISION NOT NULL,
    "sellPriceSlippage" DOUBLE PRECISION NOT NULL,
    "comparedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Slippage_pkey" PRIMARY KEY ("id")
);
