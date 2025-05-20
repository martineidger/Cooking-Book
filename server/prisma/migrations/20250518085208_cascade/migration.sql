-- DropForeignKey
ALTER TABLE "CategoryOnRecipe" DROP CONSTRAINT "CategoryOnRecipe_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryOnRecipe" DROP CONSTRAINT "CategoryOnRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "CookingStep" DROP CONSTRAINT "CookingStep_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_ingredientCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientAllergen" DROP CONSTRAINT "IngredientAllergen_allergenId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientAllergen" DROP CONSTRAINT "IngredientAllergen_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientOnRecipe" DROP CONSTRAINT "IngredientOnRecipe_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientOnRecipe" DROP CONSTRAINT "IngredientOnRecipe_ingredientUnitId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientOnRecipe" DROP CONSTRAINT "IngredientOnRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientUnit" DROP CONSTRAINT "IngredientUnit_baseUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_cuisineId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCollection" DROP CONSTRAINT "RecipeCollection_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnCollection" DROP CONSTRAINT "RecipeOnCollection_recipeCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeOnCollection" DROP CONSTRAINT "RecipeOnCollection_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookingStep" ADD CONSTRAINT "CookingStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_ingredientCategoryId_fkey" FOREIGN KEY ("ingredientCategoryId") REFERENCES "IngredientCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientOnRecipe" ADD CONSTRAINT "IngredientOnRecipe_ingredientUnitId_fkey" FOREIGN KEY ("ingredientUnitId") REFERENCES "IngredientUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientOnRecipe" ADD CONSTRAINT "IngredientOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientOnRecipe" ADD CONSTRAINT "IngredientOnRecipe_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientUnit" ADD CONSTRAINT "IngredientUnit_baseUnitId_fkey" FOREIGN KEY ("baseUnitId") REFERENCES "IngredientUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnRecipe" ADD CONSTRAINT "CategoryOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnRecipe" ADD CONSTRAINT "CategoryOnRecipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAllergen" ADD CONSTRAINT "IngredientAllergen_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAllergen" ADD CONSTRAINT "IngredientAllergen_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCollection" ADD CONSTRAINT "RecipeCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnCollection" ADD CONSTRAINT "RecipeOnCollection_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeOnCollection" ADD CONSTRAINT "RecipeOnCollection_recipeCollectionId_fkey" FOREIGN KEY ("recipeCollectionId") REFERENCES "RecipeCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
