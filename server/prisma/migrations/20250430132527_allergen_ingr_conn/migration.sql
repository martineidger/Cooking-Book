/*
  Warnings:

  - A unique constraint covering the columns `[ingredientId,allergenId]` on the table `IngredientAllergen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IngredientAllergen_ingredientId_allergenId_key" ON "IngredientAllergen"("ingredientId", "allergenId");
