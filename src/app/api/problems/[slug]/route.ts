import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/cache/redis";
import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys";
import { successResponse, notFoundResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cacheKey = CACHE_KEYS.problemBySlug(slug);

    // Try cache
    const cached = await cacheGet(cacheKey);
    if (cached) return successResponse(cached);

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isExample: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            explanation: true,
            order: true,
          },
        },
        topic: { select: { id: true, name: true, slug: true } },
        subtopic: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!problem || !problem.isPublished) {
      return notFoundResponse("Problem not found");
    }

    await cacheSet(cacheKey, problem, CACHE_TTL.problemBySlug);
    return successResponse({ problem });
  } catch (error) {
    logger.error("Failed to get problem", error);
    return errorResponse("INTERNAL_ERROR", "Failed to get problem", 500);
  }
}
