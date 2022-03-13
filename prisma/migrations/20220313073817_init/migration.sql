/*
  Warnings:

  - A unique constraint covering the columns `[userId,classId]` on the table `Enrolment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Enrolment_userId_classId_key" ON "Enrolment"("userId", "classId");
