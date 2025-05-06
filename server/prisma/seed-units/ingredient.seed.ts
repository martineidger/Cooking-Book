
import { PrismaClient } from '@prisma/client';

const unitsData = [
    { name: 'грамм', shortName: 'г', unitType: 'WEIGHT', baseUnitId: null, multiplier: 1 },
    { name: 'килограмм', shortName: 'кг', unitType: 'WEIGHT', baseUnitId: null, multiplier: 1000 },
    { name: 'миллилитр', shortName: 'мл', unitType: 'VOLUME', baseUnitId: null, multiplier: 1 },
    { name: 'литр', shortName: 'л', unitType: 'VOLUME', baseUnitId: null, multiplier: 1000 },
    { name: 'штука', shortName: 'шт', unitType: 'PIECE', baseUnitId: null, multiplier: 1 },
    { name: 'чайная ложка', shortName: 'ч.л.', unitType: 'CUSTOM', baseUnitId: null, multiplier: 5 },
    { name: 'столовая ложка', shortName: 'ст.л.', unitType: 'CUSTOM', baseUnitId: null, multiplier: 15 },
    { name: 'стакан', shortName: 'ст.', unitType: 'CUSTOM', baseUnitId: null, multiplier: 250 },
    { name: 'щепотка', shortName: 'щеп.', unitType: 'CUSTOM', baseUnitId: null, multiplier: 0.5 },
    { name: 'пучок', shortName: 'пуч.', unitType: 'CUSTOM', baseUnitId: null, multiplier: 30 }
];

const allergensData = [
    { name: 'Молоко', severity: 'High' },
    { name: 'Яйца', severity: 'Moderate' },
    { name: 'Орехи', severity: 'High' },
    { name: 'Арахис', severity: 'High' },
    { name: 'Рыба', severity: 'Moderate' },
    { name: 'Морепродукты', severity: 'Moderate' },
    { name: 'Пшеница', severity: 'Low' },
    { name: 'Соя', severity: 'Moderate' },
    { name: 'Глютен', severity: 'Trace' },
    { name: 'Горчица', severity: 'Low' }
];

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

    // Рыба и морепродукты (15)
    { name: 'Лосось', category: 'Рыба и морепродукты' },
    { name: 'Форель', category: 'Рыба и морепродукты' },
    { name: 'Тунец', category: 'Рыба и морепродукты' },
    { name: 'Сельдь', category: 'Рыба и морепродукты' },
    { name: 'Скумбрия', category: 'Рыба и морепродукты' },
    { name: 'Креветки', category: 'Рыба и морепродукты' },
    { name: 'Кальмары', category: 'Рыба и морепродукты' },
    { name: 'Мидии', category: 'Рыба и морепродукты' },
    { name: 'Осьминог', category: 'Рыба и морепродукты' },
    { name: 'Икра красная', category: 'Рыба и морепродукты' },
    { name: 'Икра черная', category: 'Рыба и морепродукты' },
    { name: 'Крабовое мясо', category: 'Рыба и морепродукты' },
    { name: 'Морской гребешок', category: 'Рыба и морепродукты' },
    { name: 'Устрицы', category: 'Рыба и морепродукты' },
    { name: 'Морской окунь', category: 'Рыба и морепродукты' },

    // Овощи (20)
    { name: 'Картофель', category: 'Овощи' },
    { name: 'Морковь', category: 'Овощи' },
    { name: 'Лук репчатый', category: 'Овощи' },
    { name: 'Чеснок', category: 'Овощи' },
    { name: 'Помидор', category: 'Овощи' },
    { name: 'Огурец', category: 'Овощи' },
    { name: 'Перец болгарский', category: 'Овощи' },
    { name: 'Баклажан', category: 'Овощи' },
    { name: 'Кабачок', category: 'Овощи' },
    { name: 'Тыква', category: 'Овощи' },
    { name: 'Свекла', category: 'Овощи' },
    { name: 'Капуста белокочанная', category: 'Овощи' },
    { name: 'Капуста цветная', category: 'Овощи' },
    { name: 'Брокколи', category: 'Овощи' },
    { name: 'Шпинат', category: 'Овощи' },
    { name: 'Салат листовой', category: 'Овощи' },
    { name: 'Редис', category: 'Овощи' },
    { name: 'Редька', category: 'Овощи' },
    { name: 'Зеленый горошек', category: 'Овощи' },
    { name: 'Кукуруза', category: 'Овощи' },

    // Фрукты и ягоды (15)
    { name: 'Яблоко', category: 'Фрукты и ягоды' },
    { name: 'Банан', category: 'Фрукты и ягоды' },
    { name: 'Апельсин', category: 'Фрукты и ягоды' },
    { name: 'Лимон', category: 'Фрукты и ягоды' },
    { name: 'Груша', category: 'Фрукты и ягоды' },
    { name: 'Персик', category: 'Фрукты и ягоды' },
    { name: 'Абрикос', category: 'Фрукты и ягоды' },
    { name: 'Слива', category: 'Фрукты и ягоды' },
    { name: 'Виноград', category: 'Фрукты и ягоды' },
    { name: 'Клубника', category: 'Фрукты и ягоды' },
    { name: 'Малина', category: 'Фрукты и ягоды' },
    { name: 'Черника', category: 'Фрукты и ягоды' },
    { name: 'Вишня', category: 'Фрукты и ягоды' },
    { name: 'Черешня', category: 'Фрукты и ягоды' },
    { name: 'Арбуз', category: 'Фрукты и ягоды' },

    // Крупы и злаки (10)
    { name: 'Рис', category: 'Крупы и злаки' },
    { name: 'Гречка', category: 'Крупы и злаки' },
    { name: 'Овсяные хлопья', category: 'Крупы и злаки' },
    { name: 'Пшено', category: 'Крупы и злаки' },
    { name: 'Перловка', category: 'Крупы и злаки' },
    { name: 'Кукурузная крупа', category: 'Крупы и злаки' },
    { name: 'Манная крупа', category: 'Крупы и злаки' },
    { name: 'Булгур', category: 'Крупы и злаки' },
    { name: 'Киноа', category: 'Крупы и злаки' },
    { name: 'Ячневая крупа', category: 'Крупы и злаки' },

    // Орехи и семена (10)
    { name: 'Грецкий орех', category: 'Орехи и семена' },
    { name: 'Миндаль', category: 'Орехи и семена' },
    { name: 'Фундук', category: 'Орехи и семена' },
    { name: 'Кешью', category: 'Орехи и семена' },
    { name: 'Арахис', category: 'Орехи и семена' },
    { name: 'Фисташки', category: 'Орехи и семена' },
    { name: 'Семена подсолнечника', category: 'Орехи и семена' },
    { name: 'Семена тыквы', category: 'Орехи и семена' },
    { name: 'Кунжут', category: 'Орехи и семена' },
    { name: 'Льняное семя', category: 'Орехи и семена' },

    // Специи и приправы (15)
    { name: 'Соль', category: 'Специи и приправы' },
    { name: 'Перец черный', category: 'Специи и приправы' },
    { name: 'Паприка', category: 'Специи и приправы' },
    { name: 'Куркума', category: 'Специи и приправы' },
    { name: 'Корица', category: 'Специи и приправы' },
    { name: 'Имбирь молотый', category: 'Специи и приправы' },
    { name: 'Карри', category: 'Специи и приправы' },
    { name: 'Орегано', category: 'Специи и приправы' },
    { name: 'Базилик', category: 'Специи и приправы' },
    { name: 'Тимьян', category: 'Специи и приправы' },
    { name: 'Розмарин', category: 'Специи и приправы' },
    { name: 'Лавровый лист', category: 'Специи и приправы' },
    { name: 'Укроп', category: 'Специи и приправы' },
    { name: 'Петрушка', category: 'Специи и приправы' },
    { name: 'Кинза', category: 'Специи и приправы' },

    // Масла и жиры (5)
    { name: 'Подсолнечное масло', category: 'Масла и жиры' },
    { name: 'Оливковое масло', category: 'Масла и жиры' },
    { name: 'Кокосовое масло', category: 'Масла и жиры' },
    { name: 'Сливочное масло', category: 'Масла и жиры' },
    { name: 'Топленое масло', category: 'Масла и жиры' },

    // Яйца (1)
    { name: 'Яйцо куриное', category: 'Яйца' },

    // Мучные изделия (10)
    { name: 'Мука пшеничная', category: 'Мучные изделия' },
    { name: 'Мука ржаная', category: 'Мучные изделия' },
    { name: 'Спагетти', category: 'Мучные изделия' },
    { name: 'Макароны', category: 'Мучные изделия' },
    { name: 'Лапша', category: 'Мучные изделия' },
    { name: 'Хлеб белый', category: 'Мучные изделия' },
    { name: 'Хлеб черный', category: 'Мучные изделия' },
    { name: 'Батон', category: 'Мучные изделия' },
    { name: 'Листы для лазаньи', category: 'Мучные изделия' },
    { name: 'Тесто слоеное', category: 'Мучные изделия' },

    // Напитки (10)
    { name: 'Вода', category: 'Напитки' },
    { name: 'Чай черный', category: 'Напитки' },
    { name: 'Чай зеленый', category: 'Напитки' },
    { name: 'Кофе молотый', category: 'Напитки' },
    { name: 'Сок апельсиновый', category: 'Напитки' },
    { name: 'Сок яблочный', category: 'Напитки' },
    { name: 'Компот', category: 'Напитки' },
    { name: 'Морс', category: 'Напитки' },
    { name: 'Квас', category: 'Напитки' },
    { name: 'Минеральная вода', category: 'Напитки' },

    // Другие (5)
    { name: 'Мёд', category: 'Другие' },
    { name: 'Сахар', category: 'Другие' },
    { name: 'Уксус', category: 'Другие' },
    { name: 'Желатин', category: 'Другие' },
    { name: 'Разрыхлитель', category: 'Другие' }
];

const ingredientAllergensData = [
    // Молочные продукты
    { ingredient: 'Молоко коровье', allergen: 'Молоко' },
    { ingredient: 'Сыр пармезан', allergen: 'Молоко' },
    { ingredient: 'Сливочное масло', allergen: 'Молоко' },
    { ingredient: 'Творог', allergen: 'Молоко' },
    { ingredient: 'Сметана', allergen: 'Молоко' },
    { ingredient: 'Йогурт натуральный', allergen: 'Молоко' },
    { ingredient: 'Сливки 20%', allergen: 'Молоко' },
    { ingredient: 'Сыр моцарелла', allergen: 'Молоко' },
    { ingredient: 'Кефир', allergen: 'Молоко' },
    { ingredient: 'Сыр чеддер', allergen: 'Молоко' },

    // Яйца
    { ingredient: 'Яйцо куриное', allergen: 'Яйца' },

    // Глютен
    { ingredient: 'Спагетти', allergen: 'Глютен' },
    { ingredient: 'Мука', allergen: 'Глютен' },
    { ingredient: 'Овсяные хлопья', allergen: 'Глютен' },
    { ingredient: 'Листы для лазаньи', allergen: 'Глютен' },

    // Орехи
    { ingredient: 'Миндаль', allergen: 'Орехи' },
    { ingredient: 'Грецкий орех', allergen: 'Орехи' },
    { ingredient: 'Кешью', allergen: 'Орехи' },

    // Рыба и морепродукты
    { ingredient: 'Лосось', allergen: 'Рыба' },
    { ingredient: 'Тунец', allergen: 'Рыба' },
    { ingredient: 'Креветки', allergen: 'Морепродукты' },
    { ingredient: 'Мидии', allergen: 'Морепродукты' }
];

export async function seedUnits(prisma: PrismaClient) {
    console.log('⌛ Заполнение единиц измерения...');

    // Сначала создаем базовые единицы
    const baseUnits = unitsData.filter(u => !u.baseUnitId);
    for (const unit of baseUnits) {
        await prisma.ingredientUnit.upsert({
            where: { name: unit.name },
            update: {},
            create: {
                name: unit.name,
                shortName: unit.shortName,
                unitType: unit.unitType as any,
                multiplier: unit.multiplier
            }
        });
    }

    // Затем производные единицы (если есть)
    const derivedUnits = unitsData.filter(u => u.baseUnitId);
    for (const unit of derivedUnits) {
        const baseUnit = await prisma.ingredientUnit.findUnique({
            where: { name: unit.baseUnitId! }
        });

        if (baseUnit) {
            await prisma.ingredientUnit.upsert({
                where: { name: unit.name },
                update: {},
                create: {
                    name: unit.name,
                    shortName: unit.shortName,
                    unitType: unit.unitType as any,
                    baseUnit: { connect: { id: baseUnit.id } },
                    multiplier: unit.multiplier
                }
            });
        }
    }

    console.log('✅ Единицы измерения успешно добавлены');
}

export async function seedAllergens(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы аллергенов...');

    for (const allergen of allergensData) {
        await prisma.allergen.upsert({
            where: { name: allergen.name },
            update: {},
            create: {
                name: allergen.name,
                severity: allergen.severity as any // Приведение типа к enum Severity
            }
        });
    }

    console.log('✅ Аллергены успешно добавлены');
}

export async function seedIngredientCategories(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы категорий ингредиентов...');

    for (const category of ingredientCategories) {
        await prisma.ingredientCategory.upsert({
            where: { name: category },
            update: {},
            create: {
                name: category,
            }
        });
    }

    console.log('✅ Категории ингредиентов успешно добавлены');
}

export async function seedIngredientAllergens(prisma: PrismaClient) {
    console.log('⌛ Связывание ингредиентов с аллергенами...');
    for (const ia of ingredientAllergensData) {
        const ingredient = await prisma.ingredient.findUnique({
            where: { name: ia.ingredient }
        });
        const allergen = await prisma.allergen.findUnique({
            where: { name: ia.allergen }
        });

        if (ingredient && allergen) {
            await prisma.ingredientAllergen.upsert({
                where: {
                    ingredientId_allergenId: {
                        ingredientId: ingredient.id,
                        allergenId: allergen.id
                    }
                },
                update: {},
                create: {
                    ingredientId: ingredient.id,
                    allergenId: allergen.id
                }
            });
        }
    }
    console.log('✅ Связи ингредиентов с аллергенами успешно добавлены');
}

export async function seedIngredients(prisma: PrismaClient) {
    console.log('⌛ Заполнение ингредиентов...');
    for (const ing of ingredientsData) {
        const category = await prisma.ingredientCategory.findUnique({
            where: { name: ing.category }
        });

        if (!category) {
            console.warn(`Категория не найдена: ${ing.category}`);
            continue;
        }

        await prisma.ingredient.upsert({
            where: { name: ing.name },
            update: {},
            create: {
                name: ing.name,
                category: { connect: { id: category.id } }
            }
        });
    }
    console.log('✅ Ингредиенты успешно добавлены');
}

