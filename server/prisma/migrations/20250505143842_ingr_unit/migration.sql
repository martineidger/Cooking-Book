/*
  Warnings:

  - You are about to drop the column `gramsAmount` on the `IngredientUnit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortName]` on the table `IngredientUnit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `IngredientUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitType` to the `IngredientUnit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('WEIGHT', 'VOLUME', 'PIECE', 'CUSTOM');

-- AlterTable
ALTER TABLE "IngredientOnRecipe" ALTER COLUMN "quantity" SET DEFAULT 1.0;

-- AlterTable
ALTER TABLE "IngredientUnit" DROP COLUMN "gramsAmount",
ADD COLUMN     "baseUnitId" TEXT,
ADD COLUMN     "multiplier" DOUBLE PRECISION DEFAULT 1.0,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "unitType" "UnitType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IngredientUnit_shortName_key" ON "IngredientUnit"("shortName");

-- CreateIndex
CREATE INDEX "IngredientUnit_unitType_idx" ON "IngredientUnit"("unitType");

-- CreateIndex
CREATE INDEX "IngredientUnit_baseUnitId_idx" ON "IngredientUnit"("baseUnitId");

-- AddForeignKey
ALTER TABLE "IngredientUnit" ADD CONSTRAINT "IngredientUnit_baseUnitId_fkey" FOREIGN KEY ("baseUnitId") REFERENCES "IngredientUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
