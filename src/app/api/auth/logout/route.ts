import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    cookieStore.delete("refreshToken");

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout failed", error);
    return errorResponse("INTERNAL_ERROR", "Logout failed", 500);
  }
}
