/*
  Warnings:

  - You are about to drop the column `category` on the `Allergen` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Allergen` table. All the data in the column will be lost.
  - You are about to drop the column `allergenId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `allergenOnRecipeId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the `AllergenOnRecipe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Allergen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,categoryId]` on the table `CategoryOnRecipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,ingredientId]` on the table `IngredientOnRecipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Trace', 'Low', 'Moderate', 'High');

-- DropForeignKey
ALTER TABLE "AllergenOnRecipe" DROP CONSTRAINT "AllergenOnRecipe_allergenId_fkey";

-- DropForeignKey
ALTER TABLE "AllergenOnRecipe" DROP CONSTRAINT "AllergenOnRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_allergenId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_allergenOnRecipeId_fkey";

-- AlterTable
ALTER TABLE "Allergen" DROP COLUMN "category",
DROP COLUMN "products",
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'Trace';

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "allergenId",
DROP COLUMN "allergenOnRecipeId";

-- DropTable
DROP TABLE "AllergenOnRecipe";

-- CreateTable
CREATE TABLE "IngredientAllergen" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,
    "customSeverity" "Severity",

    CONSTRAINT "IngredientAllergen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Allergen_name_key" ON "Allergen"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryOnRecipe_recipeId_categoryId_key" ON "CategoryOnRecipe"("recipeId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientOnRecipe_recipeId_ingredientId_key" ON "IngredientOnRecipe"("recipeId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_userId_title_key" ON "Recipe"("userId", "title");

-- AddForeignKey
ALTER TABLE "IngredientAllergen" ADD CONSTRAINT "IngredientAllergen_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAllergen" ADD CONSTRAINT "IngredientAllergen_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
