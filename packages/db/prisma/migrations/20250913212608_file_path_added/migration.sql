/*
  Warnings:

  - Added the required column `filePath` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Video" ADD COLUMN     "filePath" TEXT NOT NULL;
