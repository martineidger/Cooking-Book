import { PrismaClient } from '@prisma/client';

const cuisinesData = [
    'Русская',
    'Итальянская',
    'Французская',
    'Японская',
    'Китайская',
    'Мексиканская',
    'Индийская',
    'Тайская',
    'Грузинская',
    'Американская',
    'Другие'
];

export async function seedCuisines(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы кухонь...');

    for (const cuisine of cuisinesData) {
        await prisma.cuisine.upsert({
            where: { name: cuisine },
            update: {},
            create: { name: cuisine }
        });
    }

    console.log('✅ Кухни успешно добавлены');
}