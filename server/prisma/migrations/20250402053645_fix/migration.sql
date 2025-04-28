-- DropForeignKey
ALTER TABLE "IngredientOnRecipe" DROP CONSTRAINT "IngredientOnRecipe_recipeId_fkey";

-- AlterTable
ALTER TABLE "IngredientOnRecipe" ALTER COLUMN "recipeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "IngredientOnRecipe" ADD CONSTRAINT "IngredientOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
