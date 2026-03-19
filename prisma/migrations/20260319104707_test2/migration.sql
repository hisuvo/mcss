/*
  Warnings:

  - You are about to drop the column `fileName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploadTime` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,fileName,isDeleted]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `UserFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserFile_userId_fileId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileName",
DROP COLUMN "filePath",
DROP COLUMN "uploadTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserFile" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "UserFile_userId_isDeleted_idx" ON "UserFile"("userId", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_userId_fileName_isDeleted_key" ON "UserFile"("userId", "fileName", "isDeleted");
