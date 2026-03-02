import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Toggle bookmark on a problem
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
        payload = verifyAccessToken(authHeader.split(" ")[1]);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { problemId } = await req.json();
    if (!problemId) {
        return NextResponse.json({ error: "problemId required" }, { status: 400 });
    }

    const existing = await prisma.userProgress.findUnique({
        where: { userId_problemId: { userId: payload.userId, problemId } }
    });

    if (existing) {
        const updated = await prisma.userProgress.update({
            where: { id: existing.id },
            data: { isBookmarked: !existing.isBookmarked }
        });
        return NextResponse.json({ isBookmarked: updated.isBookmarked });
    } else {
        const created = await prisma.userProgress.create({
            data: {
                userId: payload.userId,
                problemId,
                status: "ATTEMPTED",
                isBookmarked: true,
            }
        });
        return NextResponse.json({ isBookmarked: created.isBookmarked });
    }
}

// Get bookmarked problems
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
        payload = verifyAccessToken(authHeader.split(" ")[1]);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const bookmarked = await prisma.userProgress.findMany({
        where: { userId: payload.userId, isBookmarked: true },
        include: {
            problem: {
                select: {
                    title: true, slug: true, difficulty: true,
                    platformSource: true, tags: true,
                }
            }
        },
        orderBy: { lastAttemptAt: "desc" }
    });

    return NextResponse.json(bookmarked);
}
