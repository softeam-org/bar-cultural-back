/*
  Warnings:

  - You are about to drop the column `created_by` on the `events` table. All the data in the column will be lost.
  - Added the required column `attraction` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ended_at` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "created_by",
ADD COLUMN     "attraction" TEXT NOT NULL,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "observations" TEXT[];
