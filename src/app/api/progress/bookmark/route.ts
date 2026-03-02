import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse, validationErrorResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

const bookmarkSchema = z.object({
  problemId: z.string().min(1),
  bookmarked: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return unauthorizedResponse();
    }
    let payload;
    try {
      payload = verifyAccessToken(authHeader.split(" ")[1]);
    } catch {
      return unauthorizedResponse("Invalid or expired token");
    }

    const body = await request.json();
    const parsed = bookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse("Invalid input", parsed.error.flatten().fieldErrors);
    }

    const { problemId, bookmarked } = parsed.data;

    await prisma.userProgress.upsert({
      where: {
        userId_problemId: { userId: payload.userId, problemId },
      },
      update: { isBookmarked: bookmarked },
      create: {
        userId: payload.userId,
        problemId,
        status: "ATTEMPTED",
        isBookmarked: bookmarked,
      },
    });

    return successResponse({ isBookmarked: bookmarked });
  } catch (error) {
    logger.error("Bookmark failed", error);
    return errorResponse("INTERNAL_ERROR", "Bookmark operation failed", 500);
  }
}
