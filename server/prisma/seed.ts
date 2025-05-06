import { PrismaClient } from '@prisma/client';
import { seedIngredientAllergens, seedIngredientCategories, seedIngredients, seedUnits } from './seed-units/ingredient.seed';
import { seedAllergens } from './seed-units/allergen.seed';
import { seedCuisines } from './seed-units/cuisine.seed';
import { seedCategories } from './seed-units/recipe-category.seed';
import { seedUsers } from './seed-units/user.seed';
import { seedRecipes } from './seed-units/recipe.seed';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Создаем интерфейс для чтения ввода из консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// // Функция для вопроса с подтверждением
// function askQuestion(question: string): Promise<string> {
//     return new Promise((resolve) => {
//         rl.question(question, (answer) => {
//             resolve(answer.toLowerCase());
//         });
//     });
// }

// Функция для очистки всех данных
async function clearDatabase() {
    console.log('⌛ Начало очистки базы данных...');

    // Важно соблюдать порядок удаления из-за foreign key constraints
    await prisma.note.deleteMany();
    await prisma.cookingStep.deleteMany();
    await prisma.ingredientOnRecipe.deleteMany();
    await prisma.categoryOnRecipe.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.ingredientAllergen.deleteMany();
    await prisma.ingredient.deleteMany();
    await prisma.ingredientCategory.deleteMany();
    await prisma.allergen.deleteMany();
    await prisma.ingredientUnit.deleteMany();
    await prisma.cuisine.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ База данных успешно очищена!');
}

async function main() {
    console.log('=== Заполнение базы данных ===');

    // Запрашиваем подтверждение на очистку
    //const answer = await askQuestion('Хотите очистить базу данных перед заполнением? (y/n): ');

    // if (answer === 'y' || answer === 'yes') {
    //     await clearDatabase();
    // } else {
    //     console.log('Пропуск очистки базы данных...');
    // }

    await clearDatabase();

    console.log('⌛ Начало заполнения базы данных...');

    // Порядок важен из-за зависимостей между таблицами
    await seedAllergens(prisma);
    await seedUnits(prisma);
    await seedCuisines(prisma);
    await seedCategories(prisma);
    await seedIngredientCategories(prisma);
    await seedIngredients(prisma);
    await seedIngredientAllergens(prisma);
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
        rl.close(); // Закрываем интерфейс чтения
        await prisma.$disconnect();
    });