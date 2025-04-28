import { PrismaClient } from '@prisma/client';

const ingredientCategories = [
    'Молочные продукты',
    'Мясо и птица',
    'Рыба и морепродукты',
    'Овощи',
    'Фрукты и ягоды',
    'Крупы и злаки',
    'Орехи и семена',
    'Специи и приправы',
    'Масла и жиры',
    'Яйца',
    'Мучные изделия',
    'Напитки'
];

const unitsData = [
    { name: 'грамм', gramsAmount: 1 },
    { name: 'килограмм', gramsAmount: 1000 },
    { name: 'миллилитр', gramsAmount: 1 },
    { name: 'литр', gramsAmount: 1000 },
    { name: 'штука', gramsAmount: 0 },
    { name: 'чайная ложка', gramsAmount: 5 },
    { name: 'столовая ложка', gramsAmount: 15 },
    { name: 'стакан', gramsAmount: 250 },
    { name: 'щепотка', gramsAmount: 0.5 },
    { name: 'пучок', gramsAmount: 30 }
];

const ingredientsData = [
    // Молочные продукты (10)
    { name: 'Молоко коровье', category: 'Молочные продукты' },
    { name: 'Сыр пармезан', category: 'Молочные продукты' },
    { name: 'Сливочное масло', category: 'Молочные продукты' },
    { name: 'Творог', category: 'Молочные продукты' },
    { name: 'Сметана', category: 'Молочные продукты' },
    { name: 'Йогурт натуральный', category: 'Молочные продукты' },
    { name: 'Сливки 20%', category: 'Молочные продукты' },
    { name: 'Сыр моцарелла', category: 'Молочные продукты' },
    { name: 'Кефир', category: 'Молочные продукты' },
    { name: 'Сыр чеддер', category: 'Молочные продукты' },

    // Мясо и птица (10)
    { name: 'Куриная грудка', category: 'Мясо и птица' },
    { name: 'Говяжий фарш', category: 'Мясо и птица' },
    { name: 'Свиная вырезка', category: 'Мясо и птица' },
    { name: 'Индейка (филе)', category: 'Мясо и птица' },
    { name: 'Бекон', category: 'Мясо и птица' },
    { name: 'Куриные бедра', category: 'Мясо и птица' },
    { name: 'Говяжья вырезка', category: 'Мясо и птица' },
    { name: 'Куриные крылья', category: 'Мясо и птица' },
    { name: 'Свиная шея', category: 'Мясо и птица' },
    { name: 'Фарш индейки', category: 'Мясо и птица' },

    // Остальные категории (80+)
    // ... аналогично заполняем другие категории
];

const ingredientAllergensData = [
    { ingredient: 'Молоко коровье', allergen: 'Молоко' },
    { ingredient: 'Сливочное масло', allergen: 'Молоко' },
    { ingredient: 'Яйцо куриное', allergen: 'Яйца' },
    // ... другие связи
];

export async function seedIngredients(prisma: PrismaClient) {
    console.log('⌛ Заполнение категорий ингредиентов...');
    for (const category of ingredientCategories) {
        await prisma.ingredientCategory.upsert({
            where: { name: category },
            update: {},
            create: { name: category }
        });
    }

    console.log('⌛ Заполнение единиц измерения...');
    for (const unit of unitsData) {
        await prisma.ingredientUnit.upsert({
            where: { name: unit.name },
            update: {},
            create: unit
        });
    }

    console.log('⌛ Заполнение ингредиентов...');
    for (const ing of ingredientsData) {
        const category = await prisma.ingredientCategory.findUnique({
            where: { name: ing.category }
        });

        if (!category) throw new Error(`Категория ${ing.category} не найдена`);

        await prisma.ingredient.upsert({
            where: { name: ing.name },
            update: {},
            create: {
                name: ing.name,
                category: { connect: { id: category.id } }
            }
        });
    }

    console.log('⌛ Связывание ингредиентов с аллергенами...');
    for (const ia of ingredientAllergensData) {
        const ingredient = await prisma.ingredient.findUnique({
            where: { name: ia.ingredient }
        });
        const allergen = await prisma.allergen.findUnique({
            where: { name: ia.allergen }
        });

        if (ingredient && allergen) {
            // Проверяем существование связи
            const existing = await prisma.ingredientAllergen.findFirst({
                where: {
                    ingredientId: ingredient.id,
                    allergenId: allergen.id
                }
            });

            // Если связи нет - создаем
            if (!existing) {
                await prisma.ingredientAllergen.create({
                    data: {
                        ingredientId: ingredient.id,
                        allergenId: allergen.id
                    }
                });
            }
        }
    }

    console.log('✅ Ингредиенты успешно добавлены');
}