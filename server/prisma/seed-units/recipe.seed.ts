import { PrismaClient } from '@prisma/client';

const recipesData = [
    {
        title: 'Спагетти Карбонара',
        description: 'Классический итальянский рецепт',
        portions: 2,
        cuisine: 'Итальянская',
        categories: ['Основные блюда'],
        ingredients: [
            { name: 'Спагетти', quantity: 200, unit: 'грамм' },
            { name: 'Бекон', quantity: 100, unit: 'грамм' },
            { name: 'Яйцо куриное', quantity: 2, unit: 'штука' },
            { name: 'Сыр пармезан', quantity: 50, unit: 'грамм' }
        ],
        steps: [
            {
                title: 'Приготовьте пасту',
                description: 'Варите спагетти в подсоленной воде 8-10 минут',
                order: 1,
                durationMin: 10
            },
            {
                title: 'Обжарьте бекон',
                description: 'Обжарьте бекон до хрустящей корочки',
                order: 2,
                durationMin: 5
            }
        ]
    },
    // ... другие рецепты
];

export async function seedRecipes(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы рецептов...');

    for (const recipe of recipesData) {
        const user = await prisma.user.findFirst();
        if (!user) throw new Error('Не найден пользователь для создания рецепта');

        const cuisine = await prisma.cuisine.findUnique({
            where: { name: recipe.cuisine }
        });

        const createdRecipe = await prisma.recipe.upsert({
            where: {
                userId_title: {
                    userId: user.id,
                    title: recipe.title
                }
            },
            update: {},
            create: {
                title: recipe.title,
                description: recipe.description,
                portions: recipe.portions,
                user: { connect: { id: user.id } },
                cuisine: cuisine ? { connect: { id: cuisine.id } } : undefined
            }
        });

        // Добавляем категории
        for (const catName of recipe.categories) {
            const category = await prisma.category.findUnique({
                where: { name: catName }
            });

            if (category) {
                await prisma.categoryOnRecipe.upsert({
                    where: {
                        recipeId_categoryId: {
                            recipeId: createdRecipe.id,
                            categoryId: category.id
                        }
                    },
                    update: {},
                    create: {
                        recipe: { connect: { id: createdRecipe.id } },
                        category: { connect: { id: category.id } }
                    }
                });
            }
        }

        // Добавляем ингредиенты
        for (const ing of recipe.ingredients) {
            const ingredient = await prisma.ingredient.findUnique({
                where: { name: ing.name }
            });
            const unit = await prisma.ingredientUnit.findUnique({
                where: { name: ing.unit }
            });

            if (ingredient && unit) {
                await prisma.ingredientOnRecipe.upsert({
                    where: {
                        recipeId_ingredientId: {
                            recipeId: createdRecipe.id,
                            ingredientId: ingredient.id
                        }
                    },
                    update: {},
                    create: {
                        quantity: ing.quantity,
                        recipe: { connect: { id: createdRecipe.id } },
                        ingredient: { connect: { id: ingredient.id } },
                        unit: { connect: { id: unit.id } }
                    }
                });
            }
        }

        // Добавляем шаги приготовления
        for (const step of recipe.steps) {
            await prisma.cookingStep.create({
                data: {
                    title: step.title,
                    description: step.description,
                    order: step.order,
                    durationMin: step.durationMin,
                    recipe: { connect: { id: createdRecipe.id } }
                }
            });
        }
    }

    console.log('✅ Рецепты успешно добавлены');
}