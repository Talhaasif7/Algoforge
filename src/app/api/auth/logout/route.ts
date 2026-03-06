import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let userId: string | undefined;

    if (refreshToken) {
      const stored = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        select: { userId: true },
      });
      if (stored) {
        userId = stored.userId;
        await prisma.refreshToken.delete({ where: { token: refreshToken } });
      }
    }
    await clearAuthCookies(userId);

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout failed", error);
    return errorResponse("INTERNAL_ERROR", "Logout failed", 500);
  }
}
