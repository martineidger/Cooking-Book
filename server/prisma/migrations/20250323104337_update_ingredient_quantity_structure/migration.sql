/*
  Warnings:

  - Added the required column `ingredientCategoryId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientUnitId` to the `IngredientOnRecipe` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `quantity` on the `IngredientOnRecipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "ingredientCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IngredientOnRecipe" ADD COLUMN     "ingredientUnitId" TEXT NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "IngredientCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IngredientCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IngredientUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_ingredientCategoryId_fkey" FOREIGN KEY ("ingredientCategoryId") REFERENCES "IngredientCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientOnRecipe" ADD CONSTRAINT "IngredientOnRecipe_ingredientUnitId_fkey" FOREIGN KEY ("ingredientUnitId") REFERENCES "IngredientUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
