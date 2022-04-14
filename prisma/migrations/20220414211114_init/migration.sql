/*
  Warnings:

  - The values [USED_FIND_IN_PAGE] on the enum `ActivityName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityName_new" AS ENUM ('SWITCHED_TAB', 'LOSE_WINDOW_FOCUS', 'USED_PASTE_FUNCTION', 'ACCESSED_SITE', 'USED_SEARCH_ENGINE', 'FINISHED_EXAM_FAST', 'ENTERED_EXAM_LATE', 'FINISHED_EXAM', 'WENT_IDLE', 'JOINED_EXAM', 'RETURNED');
ALTER TABLE "Activity" ALTER COLUMN "name" TYPE "ActivityName_new" USING ("name"::text::"ActivityName_new");
ALTER TYPE "ActivityName" RENAME TO "ActivityName_old";
ALTER TYPE "ActivityName_new" RENAME TO "ActivityName";
DROP TYPE "ActivityName_old";
COMMIT;
