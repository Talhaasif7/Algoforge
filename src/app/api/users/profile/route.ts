import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { updateProfileSchema } from "@/lib/validations/user";

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return unauthorizedResponse();
        }

        const token = authHeader.split(" ")[1];
        let payload;
        try {
            payload = verifyAccessToken(token);
        } catch {
            return unauthorizedResponse("Invalid or expired token");
        }

        const body = await request.json();
        const validation = updateProfileSchema.safeParse(body);

        if (!validation.success) {
            return validationErrorResponse("Invalid input", validation.error.format());
        }

        const { name, avatar, bio } = validation.data;

        const updatedUser = await prisma.user.update({
            where: { id: payload.userId },
            data: {
                ...(name && { name }),
                ...(avatar !== undefined && { avatar }),
                ...(bio !== undefined && { bio }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
                bio: true,
            },
        });

        return successResponse({ user: updatedUser });
    } catch (error) {
        logger.error("Update profile failed", error);
        return errorResponse("INTERNAL_ERROR", "Failed to update profile", 500);
    }
}
