import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Save/update notes for a problem
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

    const { problemId, notes } = await req.json();
    if (!problemId) {
        return NextResponse.json({ error: "problemId required" }, { status: 400 });
    }

    const existing = await prisma.userProgress.findUnique({
        where: { userId_problemId: { userId: payload.userId, problemId } }
    });

    if (existing) {
        await prisma.userProgress.update({
            where: { id: existing.id },
            data: { notes }
        });
    } else {
        await prisma.userProgress.create({
            data: {
                userId: payload.userId,
                problemId,
                status: "ATTEMPTED",
                notes,
            }
        });
    }

    return NextResponse.json({ success: true });
}

// Get notes for a specific problem
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

    const problemId = req.nextUrl.searchParams.get("problemId");
    if (!problemId) {
        return NextResponse.json({ error: "problemId required" }, { status: 400 });
    }

    const progress = await prisma.userProgress.findUnique({
        where: { userId_problemId: { userId: payload.userId, problemId } },
        select: { notes: true, isBookmarked: true }
    });

    return NextResponse.json({ notes: progress?.notes || "", isBookmarked: progress?.isBookmarked || false });
}
