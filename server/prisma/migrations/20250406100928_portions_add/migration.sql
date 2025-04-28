/*
  Warnings:

  - Added the required column `allergenId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gramsNumber` to the `IngredientUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portions` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "allergenId" TEXT NOT NULL,
ADD COLUMN     "allergenOnRecipeId" TEXT;

-- AlterTable
ALTER TABLE "IngredientUnit" ADD COLUMN     "gramsNumber" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "portions" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Allergen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "products" TEXT[],
    "category" TEXT NOT NULL,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllergenOnRecipe" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,

    CONSTRAINT "AllergenOnRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_allergenOnRecipeId_fkey" FOREIGN KEY ("allergenOnRecipeId") REFERENCES "AllergenOnRecipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllergenOnRecipe" ADD CONSTRAINT "AllergenOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllergenOnRecipe" ADD CONSTRAINT "AllergenOnRecipe_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
