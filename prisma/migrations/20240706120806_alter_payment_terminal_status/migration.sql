/*
  Warnings:

  - You are about to drop the `payment_terminals` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Ativo', 'Inativo');

-- DropTable
DROP TABLE "payment_terminals";

-- CreateTable
CREATE TABLE "paymentTerminals" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "paymentTerminals_pkey" PRIMARY KEY ("id")
);
