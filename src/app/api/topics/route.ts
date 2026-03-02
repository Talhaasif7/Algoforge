import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/cache/redis";
import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const track = searchParams.get("track");

    const cacheKey = CACHE_KEYS.allTopics();
    const cached = await cacheGet(cacheKey);
    if (cached && !track) return successResponse(cached);

    const where: Record<string, unknown> = {};
    if (track) where.track = track;

    const topics = await prisma.topic.findMany({
      where,
      include: {
        subtopics: {
          orderBy: { order: "asc" },
          include: {
            _count: { select: { problems: true } },
          },
        },
        _count: { select: { problems: true } },
      },
      orderBy: { order: "asc" },
    });

    if (!track) {
      await cacheSet(cacheKey, { topics }, CACHE_TTL.allTopics);
    }

    return successResponse({ topics });
  } catch (error) {
    logger.error("Failed to list topics", error);
    return errorResponse("INTERNAL_ERROR", "Failed to list topics", 500);
  }
}
