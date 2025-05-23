import { PrismaClient } from '@prisma/client';

const categoriesData = [
    'Завтраки',
    'Супы',
    'Салаты',
    'Основные блюда',
    'Десерты',
    'Выпечка',
    'Закуски',
    'Напитки',
    'Соусы',
    'Вегетарианские',
    'Другие'
];

export async function seedCategories(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы категорий...');

    for (const category of categoriesData) {
        await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category }
        });
    }

    console.log('✅ Категории успешно добавлены');
}