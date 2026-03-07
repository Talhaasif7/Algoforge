import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

async function test() {
    console.log("🧪 Testing Profile Update API...");

    // 1. Get or create a test user
    let user = await prisma.user.findFirst({ where: { email: 'admin@admin.com' } });
    if (!user) {
        console.log("❌ Test user (admin@admin.com) not found. Run seed first.");
        return;
    }

    // 2. Generate a token for the user
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log(`👤 Testing with user: ${user.username} (${user.id})`);

    try {
        // 3. Call the PATCH API
        const response = await axios.patch('http://localhost:3000/api/users/profile', {
            name: "Updated Admin Name",
            bio: "This is an updated bio for testing.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
            console.log("✅ API call successful!");
            console.log("📄 Response data:", JSON.stringify(response.data.data, null, 2));

            // 4. Verify in DB
            const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
            if (updatedUser?.name === "Updated Admin Name" && updatedUser?.bio === "This is an updated bio for testing.") {
                console.log("✅ Database verification successful!");
            } else {
                console.log("❌ Database verification failed!");
            }
        } else {
            console.log("❌ API call failed:", response.data.error);
        }
    } catch (error: any) {
        console.error("❌ Request failed:", error.response?.data || error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
