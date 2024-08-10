/*
  Warnings:

  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "events_name_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "description",
ALTER COLUMN "observations" SET NOT NULL,
ALTER COLUMN "observations" SET DATA TYPE TEXT;
