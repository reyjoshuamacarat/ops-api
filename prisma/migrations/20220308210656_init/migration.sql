/*
  Warnings:

  - Added the required column `link` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('TEAMS', 'GOOGLE_FORMS', 'MOODLE');

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "platform" "Platform" NOT NULL DEFAULT E'TEAMS';
