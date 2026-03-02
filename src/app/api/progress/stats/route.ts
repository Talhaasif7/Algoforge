import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

export async function GET(request: Request) {
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

    const userId = payload.userId;

    // Aggregate stats
    const [totalSolved, byDifficulty, recentSubmissions] = await Promise.all([
      prisma.userProgress.count({
        where: { userId, status: "SOLVED" },
      }),
      prisma.userProgress.findMany({
        where: { userId, status: "SOLVED" },
        include: { problem: { select: { difficulty: true } } },
      }),
      prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          language: true,
          runtime: true,
          createdAt: true,
          problem: { select: { title: true, slug: true, difficulty: true } },
        },
      }),
    ]);

    const easy = byDifficulty.filter((p: any) => p.problem.difficulty === "EASY").length;
    const medium = byDifficulty.filter((p: any) => p.problem.difficulty === "MEDIUM").length;
    const hard = byDifficulty.filter((p: any) => p.problem.difficulty === "HARD").length;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, longestStreak: true },
    });

    return successResponse({
      totalSolved,
      byDifficulty: { easy, medium, hard },
      currentStreak: user?.streak || 0,
      longestStreak: user?.longestStreak || 0,
      xp: user?.xp || 0,
      level: user?.level || 1,
      recentActivity: recentSubmissions,
    });
  } catch (error) {
    logger.error("Failed to get progress stats", error);
    return errorResponse("INTERNAL_ERROR", "Failed to get stats", 500);
  }
}
