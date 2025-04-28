import { PrismaClient, Severity } from '@prisma/client';

const allergensData = [
    { name: 'Молоко', severity: Severity.High },
    { name: 'Яйца', severity: Severity.High },
    { name: 'Орехи', severity: Severity.High },
    { name: 'Арахис', severity: Severity.High },
    { name: 'Рыба', severity: Severity.Moderate },
    { name: 'Моллюски', severity: Severity.Moderate },
    { name: 'Пшеница', severity: Severity.Low },
    { name: 'Соя', severity: Severity.Low },
    { name: 'Глютен', severity: Severity.Moderate },
    { name: 'Кунжут', severity: Severity.Moderate }
];

export async function seedAllergens(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы аллергенов...');

    for (const allergen of allergensData) {
        await prisma.allergen.upsert({
            where: { name: allergen.name },
            update: {},
            create: allergen
        });
    }

    console.log('✅ Аллергены успешно добавлены');
}