import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/auth/constants";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value || null;
    }

    if (!token) {
      return unauthorizedResponse();
    }
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return unauthorizedResponse("Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        xp: true,
        level: true,
        streak: true,
        longestStreak: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return unauthorizedResponse("User not found");
    }

    return successResponse({ user });
  } catch (error) {
    logger.error("Get current user failed", error);
    return errorResponse("INTERNAL_ERROR", "Failed to get user", 500);
  }
}
