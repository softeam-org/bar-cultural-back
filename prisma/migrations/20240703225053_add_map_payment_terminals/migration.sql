/*
  Warnings:

  - You are about to drop the `Payment_terminal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Payment_terminal";

-- CreateTable
CREATE TABLE "payment_terminals" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "payment_terminals_pkey" PRIMARY KEY ("id")
);
