import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const usersData = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: Role.Admin
    },
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'user1123',
        role: Role.User
    },
    {
        username: 'chef',
        email: 'chef@example.com',
        password: 'chef123',
        role: Role.User
    }
];

export async function seedUsers(prisma: PrismaClient) {
    console.log('⌛ Заполнение таблицы пользователей...');

    for (const user of usersData) {
        const hashedPassword = await hash(user.password, 10);

        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                username: user.username,
                email: user.email,
                password: hashedPassword,
                role: user.role
            }
        });
    }

    console.log('✅ Пользователи успешно добавлены');
}