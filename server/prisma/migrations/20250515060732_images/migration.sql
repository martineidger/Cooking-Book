/*
  Warnings:

  - You are about to drop the column `image` on the `CookingStep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CookingStep" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
