/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `IngredientCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `IngredientUnit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CookingPhase" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,

    CONSTRAINT "CookingPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookingStep" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL,
    "durationMin" INTEGER NOT NULL,

    CONSTRAINT "CookingStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_name_key" ON "IngredientCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientUnit_name_key" ON "IngredientUnit"("name");

-- AddForeignKey
ALTER TABLE "CookingPhase" ADD CONSTRAINT "CookingPhase_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookingStep" ADD CONSTRAINT "CookingStep_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "CookingPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
