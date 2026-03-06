import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const email = 'admin@admin.com';
    const password = 'admin';

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existingUser) {
        console.log('Admin user already exists:', existingUser.email);
        console.log('Updating password to ensure it matches the requested one...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: existingUser.id },
            data: { passwordHash: hashedPassword, role: 'ADMIN', isEmailVerified: true }
        });
        console.log('Admin user password has been reset successfully.');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash: hashedPassword,
            name: 'Super Admin',
            role: 'ADMIN',
            isEmailVerified: true
        }
    });

    console.log(`Created superuser: ${admin.username} / ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
