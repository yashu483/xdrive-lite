/*
  Warnings:

  - A unique constraint covering the columns `[userId,folderId,id]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Files_userId_folderId_id_key" ON "Files"("userId", "folderId", "id");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
