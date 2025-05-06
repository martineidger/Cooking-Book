import { PrismaClient } from '@prisma/client';

const recipesData = [
    {
        title: 'Спагетти Карбонара',
        description: 'Классический итальянский рецепт пасты с беконом, яйцами и сыром',
        portions: 2,
        cuisine: 'Итальянская',
        categories: ['Основные блюда'],
        ingredients: [
            { name: 'Спагетти', quantity: 200, unit: 'грамм' },
            { name: 'Бекон', quantity: 100, unit: 'грамм' },
            { name: 'Яйцо куриное', quantity: 2, unit: 'штука' },
            { name: 'Сыр пармезан', quantity: 50, unit: 'грамм' },
            { name: 'Чеснок', quantity: 1, unit: 'зубчик' }
        ],
        steps: [
            {
                title: 'Приготовьте пасту',
                description: 'Варите спагетти в подсоленной воде 8-10 минут до состояния al dente',
                order: 1,
                durationMin: 10
            },
            {
                title: 'Обжарьте бекон',
                description: 'Обжарьте бекон на среднем огне до хрустящей корочки',
                order: 2,
                durationMin: 5
            },
            {
                title: 'Смешайте ингредиенты',
                description: 'Смешайте готовые спагетти с беконом, яйцами и сыром',
                order: 3,
                durationMin: 2
            }
        ]
    },
    {
        title: 'Овсяная каша с фруктами',
        description: 'Полезный и сытный завтрак',
        portions: 1,
        cuisine: 'Международная',
        categories: ['Завтраки', 'Вегетарианские'],
        ingredients: [
            { name: 'Овсяные хлопья', quantity: 50, unit: 'грамм' },
            { name: 'Молоко коровье', quantity: 200, unit: 'миллилитр' },
            { name: 'Мёд', quantity: 1, unit: 'чайная ложка' },
            { name: 'Банан', quantity: 0.5, unit: 'штука' },
            { name: 'Яблоко', quantity: 0.5, unit: 'штука' }
        ],
        steps: [
            {
                title: 'Приготовьте кашу',
                description: 'Сварите овсяные хлопья на молоке 5-7 минут',
                order: 1,
                durationMin: 7
            },
            {
                title: 'Добавьте фрукты',
                description: 'Нарежьте фрукты и добавьте в готовую кашу',
                order: 2,
                durationMin: 3
            }
        ]
    },
    {
        title: 'Греческий салат',
        description: 'Классический салат с фетаксой и свежими овощами',
        portions: 2,
        cuisine: 'Греческая',
        categories: ['Салаты', 'Вегетарианские'],
        ingredients: [
            { name: 'Огурец', quantity: 1, unit: 'штука' },
            { name: 'Помидор', quantity: 2, unit: 'штука' },
            { name: 'Перец болгарский', quantity: 1, unit: 'штука' },
            { name: 'Лук красный', quantity: 0.5, unit: 'штука' },
            { name: 'Сыр фета', quantity: 100, unit: 'грамм' },
            { name: 'Оливки', quantity: 50, unit: 'грамм' },
            { name: 'Оливковое масло', quantity: 2, unit: 'столовая ложка' }
        ],
        steps: [
            {
                title: 'Нарежьте овощи',
                description: 'Нарежьте все овощи крупными кубиками',
                order: 1,
                durationMin: 10
            },
            {
                title: 'Соберите салат',
                description: 'Смешайте овощи, добавьте сыр и оливки, заправьте маслом',
                order: 2,
                durationMin: 5
            }
        ]
    },
    {
        title: 'Борщ',
        description: 'Традиционный украинский борщ со свеклой и мясом',
        portions: 4,
        cuisine: 'Украинская',
        categories: ['Супы'],
        ingredients: [
            { name: 'Говядина', quantity: 400, unit: 'грамм' },
            { name: 'Свекла', quantity: 2, unit: 'штука' },
            { name: 'Картофель', quantity: 3, unit: 'штука' },
            { name: 'Капуста белокочанная', quantity: 200, unit: 'грамм' },
            { name: 'Морковь', quantity: 1, unit: 'штука' },
            { name: 'Лук репчатый', quantity: 1, unit: 'штука' },
            { name: 'Томатная паста', quantity: 2, unit: 'столовая ложка' },
            { name: 'Сметана', quantity: 100, unit: 'грамм' }
        ],
        steps: [
            {
                title: 'Приготовьте бульон',
                description: 'Варите мясо 1.5 часа до готовности',
                order: 1,
                durationMin: 90
            },
            {
                title: 'Подготовьте овощи',
                description: 'Нарежьте овощи и пассеруйте лук, морковь и свеклу',
                order: 2,
                durationMin: 15
            },
            {
                title: 'Сварите борщ',
                description: 'Добавьте овощи в бульон и варите еще 20 минут',
                order: 3,
                durationMin: 20
            }
        ]
    },
    {
        title: 'Шоколадный мусс',
        description: 'Нежный десерт с насыщенным шоколадным вкусом',
        portions: 4,
        cuisine: 'Французская',
        categories: ['Десерты'],
        ingredients: [
            { name: 'Шоколад темный', quantity: 200, unit: 'грамм' },
            { name: 'Сливочное масло', quantity: 50, unit: 'грамм' },
            { name: 'Яйцо куриное', quantity: 3, unit: 'штука' },
            { name: 'Сахар', quantity: 50, unit: 'грамм' }
        ],
        steps: [
            {
                title: 'Растопите шоколад',
                description: 'Растопите шоколад с маслом на водяной бане',
                order: 1,
                durationMin: 10
            },
            {
                title: 'Приготовьте яичную смесь',
                description: 'Взбейте желтки с сахаром, а белки отдельно до пиков',
                order: 2,
                durationMin: 10
            },
            {
                title: 'Смешайте ингредиенты',
                description: 'Аккуратно соедините все компоненты и разлейте по формам',
                order: 3,
                durationMin: 5
            },
            {
                title: 'Охладите',
                description: 'Поставьте в холодильник на 4 часа',
                order: 4,
                durationMin: 240
            }
        ]
    },
    {
        title: 'Курица терияки',
        description: 'Курица в сладковато-соленом соусе с кунжутом',
        portions: 2,
        cuisine: 'Японская',
        categories: ['Основные блюда'],
        ingredients: [
            { name: 'Куриная грудка', quantity: 2, unit: 'штука' },
            { name: 'Соус терияки', quantity: 50, unit: 'миллилитр' },
            { name: 'Чеснок', quantity: 2, unit: 'зубчик' },
            { name: 'Имбирь', quantity: 10, unit: 'грамм' },
            { name: 'Кунжут', quantity: 1, unit: 'чайная ложка' },
            { name: 'Растительное масло', quantity: 2, unit: 'столовая ложка' }
        ],
        steps: [
            {
                title: 'Маринуйте курицу',
                description: 'Замаринуйте курицу в соусе терияки с чесноком и имбирем на 30 минут',
                order: 1,
                durationMin: 30
            },
            {
                title: 'Обжарьте курицу',
                description: 'Обжарьте курицу на сковороде до золотистой корочки',
                order: 2,
                durationMin: 10
            },
            {
                title: 'Подавайте',
                description: 'Посыпьте кунжутом и подавайте с рисом',
                order: 3,
                durationMin: 2
            }
        ]
    },
    {
        title: 'Омлет с овощами',
        description: 'Пышный омлет с болгарским перцем и помидорами',
        portions: 1,
        cuisine: 'Французская',
        categories: ['Завтраки', 'Вегетарианские'],
        ingredients: [
            { name: 'Яйцо куриное', quantity: 3, unit: 'штука' },
            { name: 'Молоко коровье', quantity: 50, unit: 'миллилитр' },
            { name: 'Помидор', quantity: 1, unit: 'штука' },
            { name: 'Перец болгарский', quantity: 0.5, unit: 'штука' },
            { name: 'Зелень', quantity: 1, unit: 'пучок' },
            { name: 'Соль', quantity: 1, unit: 'щепотка' }
        ],
        steps: [
            {
                title: 'Подготовьте овощи',
                description: 'Нарежьте овощи мелкими кубиками',
                order: 1,
                durationMin: 5
            },
            {
                title: 'Приготовьте омлет',
                description: 'Взбейте яйца с молоком, добавьте овощи и жарьте на среднем огне 5-7 минут',
                order: 2,
                durationMin: 7
            }
        ]
    },
    {
        title: 'Лазанья',
        description: 'Итальянская запеканка с мясным фаршем и сыром',
        portions: 6,
        cuisine: 'Итальянская',
        categories: ['Основные блюда'],
        ingredients: [
            { name: 'Листы для лазаньи', quantity: 250, unit: 'грамм' },
            { name: 'Говяжий фарш', quantity: 500, unit: 'грамм' },
            { name: 'Сыр моцарелла', quantity: 200, unit: 'грамм' },
            { name: 'Сыр пармезан', quantity: 100, unit: 'грамм' },
            { name: 'Томатная паста', quantity: 100, unit: 'грамм' },
            { name: 'Лук репчатый', quantity: 1, unit: 'штука' },
            { name: 'Чеснок', quantity: 2, unit: 'зубчик' },
            { name: 'Молоко коровье', quantity: 500, unit: 'миллилитр' },
            { name: 'Сливочное масло', quantity: 50, unit: 'грамм' },
            { name: 'Мука', quantity: 50, unit: 'грамм' }
        ],
        steps: [
            {
                title: 'Приготовьте мясной соус',
                description: 'Обжарьте лук, чеснок и фарш, добавьте томатную пасту и тушите 15 минут',
                order: 1,
                durationMin: 20
            },
            {
                title: 'Приготовьте бешамель',
                description: 'Растопите масло, добавьте муку и молоко, варите до загустения',
                order: 2,
                durationMin: 10
            },
            {
                title: 'Соберите лазанью',
                description: 'Выкладывайте слоями листы лазаньи, мясной соус и соус бешамель',
                order: 3,
                durationMin: 15
            },
            {
                title: 'Запеките',
                description: 'Посыпьте сыром и запекайте 30 минут при 180°C',
                order: 4,
                durationMin: 30
            }
        ]
    },
    {
        title: 'Тыквенный суп-пюре',
        description: 'Нежный крем-суп с тыквой и сливками',
        portions: 4,
        cuisine: 'Международная',
        categories: ['Супы', 'Вегетарианские'],
        ingredients: [
            { name: 'Тыква', quantity: 500, unit: 'грамм' },
            { name: 'Морковь', quantity: 1, unit: 'штука' },
            { name: 'Лук репчатый', quantity: 1, unit: 'штука' },
            { name: 'Чеснок', quantity: 2, unit: 'зубчик' },
            { name: 'Сливки 20%', quantity: 200, unit: 'миллилитр' },
            { name: 'Оливковое масло', quantity: 2, unit: 'столовая ложка' },
            { name: 'Имбирь', quantity: 10, unit: 'грамм' },
            { name: 'Соль', quantity: 1, unit: 'щепотка' }
        ],
        steps: [
            {
                title: 'Подготовьте овощи',
                description: 'Нарежьте овощи кубиками и обжарьте на оливковом масле',
                order: 1,
                durationMin: 10
            },
            {
                title: 'Сварите суп',
                description: 'Залейте овощи водой и варите 20 минут до мягкости',
                order: 2,
                durationMin: 20
            },
            {
                title: 'Приготовьте пюре',
                description: 'Измельчите суп блендером, добавьте сливки и прогрейте',
                order: 3,
                durationMin: 5
            }
        ]
    },
    {
        title: 'Панкейки',
        description: 'Американские пышные блинчики с кленовым сиропом',
        portions: 2,
        cuisine: 'Американская',
        categories: ['Завтраки', 'Выпечка'],
        ingredients: [
            { name: 'Мука', quantity: 200, unit: 'грамм' },
            { name: 'Яйцо куриное', quantity: 1, unit: 'штука' },
            { name: 'Молоко коровье', quantity: 200, unit: 'миллилитр' },
            { name: 'Сахар', quantity: 2, unit: 'столовая ложка' },
            { name: 'Разрыхлитель', quantity: 1, unit: 'чайная ложка' },
            { name: 'Сливочное масло', quantity: 30, unit: 'грамм' },
            { name: 'Кленовый сироп', quantity: 50, unit: 'миллилитр' }
        ],
        steps: [
            {
                title: 'Приготовьте тесто',
                description: 'Смешайте все сухие ингредиенты, затем добавьте жидкие и перемешайте',
                order: 1,
                durationMin: 5
            },
            {
                title: 'Жарьте панкейки',
                description: 'Выпекайте на среднем огне по 2-3 минуты с каждой стороны',
                order: 2,
                durationMin: 15
            },
            {
                title: 'Подавайте',
                description: 'Подавайте с кленовым сиропом и кусочками масла',
                order: 3,
                durationMin: 2
            }
        ]
    }
];

// export async function seedRecipes(prisma: PrismaClient) {
//     console.log('⌛ Заполнение таблицы рецептов...');

//     for (const recipe of recipesData) {
//         const user = await prisma.user.findFirst();
//         if (!user) throw new Error('Не найден пользователь для создания рецепта');

//         const cuisine = await prisma.cuisine.findUnique({
//             where: { name: recipe.cuisine }
//         });

//         const createdRecipe = await prisma.recipe.upsert({
//             where: {
//                 userId_title: {
//                     userId: user.id,
//                     title: recipe.title
//                 }
//             },
//             update: {},
//             create: {
//                 title: recipe.title,
//                 description: recipe.description,
//                 portions: recipe.portions,
//                 user: { connect: { id: user.id } },
//                 cuisine: cuisine ? { connect: { id: cuisine.id } } : undefined
//             }
//         });

//         // Добавляем категории
//         for (const catName of recipe.categories) {
//             const category = await prisma.category.findUnique({
//                 where: { name: catName }
//             });

//             if (category) {
//                 await prisma.categoryOnRecipe.upsert({
//                     where: {
//                         recipeId_categoryId: {
//                             recipeId: createdRecipe.id,
//                             categoryId: category.id
//                         }
//                     },
//                     update: {},
//                     create: {
//                         recipe: { connect: { id: createdRecipe.id } },
//                         category: { connect: { id: category.id } }
//                     }
//                 });
//             }
//         }

//         // Добавляем ингредиенты
//         for (const ing of recipe.ingredients) {
//             const ingredient = await prisma.ingredient.findUnique({
//                 where: { name: ing.name }
//             });
//             const unit = await prisma.ingredientUnit.findUnique({
//                 where: { name: ing.unit }
//             });

//             if (ingredient && unit) {
//                 await prisma.ingredientOnRecipe.upsert({
//                     where: {
//                         recipeId_ingredientId: {
//                             recipeId: createdRecipe.id,
//                             ingredientId: ingredient.id
//                         }
//                     },
//                     update: {},
//                     create: {
//                         quantity: ing.quantity,
//                         recipe: { connect: { id: createdRecipe.id } },
//                         ingredient: { connect: { id: ingredient.id } },
//                         unit: { connect: { id: unit.id } }
//                     }
//                 });
//             }
//         }

//         // Добавляем шаги приготовления
//         for (const step of recipe.steps) {
//             await prisma.cookingStep.create({
//                 data: {
//                     title: step.title,
//                     description: step.description,
//                     order: step.order,
//                     durationMin: step.durationMin,
//                     recipe: { connect: { id: createdRecipe.id } }
//                 }
//             });
//         }
//     }

//     console.log('✅ Рецепты успешно добавлены');
// }


export async function seedRecipes(prisma: PrismaClient) {
    console.log('⌛ Заполнение рецептов...');

    for (const recipe of recipesData) {
        const user = await prisma.user.findFirst();
        if (!user) throw new Error('Не найден пользователь для создания рецепта');

        const cuisine = await prisma.cuisine.findUnique({
            where: { name: recipe.cuisine }
        });

        // Создаем рецепт
        const createdRecipe = await prisma.recipe.create({
            data: {
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
                await prisma.categoryOnRecipe.create({
                    data: {
                        recipe: { connect: { id: createdRecipe.id } },
                        category: { connect: { id: category.id } }
                    }
                });
            }
        }

        // Добавляем ингредиенты с учетом единиц измерения
        for (const ing of recipe.ingredients) {
            const ingredient = await prisma.ingredient.findUnique({
                where: { name: ing.name }
            });
            const unit = await prisma.ingredientUnit.findUnique({
                where: { name: ing.unit }
            });

            if (ingredient && unit) {
                await prisma.ingredientOnRecipe.create({
                    data: {
                        quantity: ing.quantity,
                        recipe: { connect: { id: createdRecipe.id } },
                        ingredient: { connect: { id: ingredient.id } },
                        unit: { connect: { id: unit.id } },
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

// Вспомогательная функция для расчета базового количества
async function calculateBaseQuantity(prisma: PrismaClient, quantity: number, unitId: string): Promise<number> {
    const unit = await prisma.ingredientUnit.findUnique({
        where: { id: unitId },
        include: { baseUnit: true }
    });

    if (!unit) throw new Error('Unit not found');

    // Если это базовая единица или нет множителя
    if (!unit.baseUnitId || unit.multiplier === null) {
        return quantity;
    }

    // Конвертируем в базовую единицу
    return quantity * unit.multiplier;
}