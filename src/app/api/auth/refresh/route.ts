import { prisma } from "@/lib/db/prisma";
import { generateAccessToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return unauthorizedResponse("No refresh token");
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      return unauthorizedResponse("Invalid or expired refresh token");
    }

    const accessToken = generateAccessToken({
      userId: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    });

    return successResponse({ accessToken });
  } catch (error) {
    logger.error("Token refresh failed", error);
    return errorResponse("INTERNAL_ERROR", "Token refresh failed", 500);
  }
}
