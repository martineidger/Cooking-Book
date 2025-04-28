-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_allergenId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "allergenId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
