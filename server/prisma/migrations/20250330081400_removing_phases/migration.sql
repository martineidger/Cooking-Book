/*
  Warnings:

  - You are about to drop the column `phaseId` on the `CookingStep` table. All the data in the column will be lost.
  - You are about to drop the `CookingPhase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipeId` to the `CookingStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CookingStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CookingPhase" DROP CONSTRAINT "CookingPhase_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "CookingStep" DROP CONSTRAINT "CookingStep_phaseId_fkey";

-- AlterTable
ALTER TABLE "CookingStep" DROP COLUMN "phaseId",
ADD COLUMN     "cookingPhaseId" TEXT,
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "CookingPhase";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CookingStep" ADD CONSTRAINT "CookingStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
