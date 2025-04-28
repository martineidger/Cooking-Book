import { PrismaClient } from '@prisma/client';
import { seedIngredients } from './seed-units/ingredient.seed';
import { seedAllergens } from './seed-units/allergen.seed';
import { seedCuisines } from './seed-units/cuisine.seed';
import { seedCategories } from './seed-units/recipe-category.seed';
import { seedUsers } from './seed-units/user.seed';
import { seedRecipes } from './seed-units/recipe.seed';

const prisma = new PrismaClient();

async function main() {
    console.log('Начало заполнения базы данных...');

    await seedAllergens(prisma);
    await seedCuisines(prisma);
    await seedCategories(prisma);
    await seedIngredients(prisma);
    await seedUsers(prisma);
    await seedRecipes(prisma);

    console.log('✅ База данных успешно заполнена!');
}

main()
    .catch(e => {
        console.error('Ошибка заполнения:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });