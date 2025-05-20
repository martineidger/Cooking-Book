/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CookingStep" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "imageUrl" TEXT;
