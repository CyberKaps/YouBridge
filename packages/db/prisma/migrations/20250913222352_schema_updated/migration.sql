/*
  Warnings:

  - Added the required column `youtuberId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Video" ADD COLUMN     "youtuberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
