import { GradientText } from "@/components/shared/GradientText";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink, Filter } from "lucide-react";

export const revalidate = 60;

const DIFF_COLORS: Record<string, string> = {
    EASY: "text-accent-green bg-accent-green/10",
    MEDIUM: "text-accent-yellow bg-accent-yellow/10",
    HARD: "text-red-400 bg-red-500/10",
};

export default async function ProblemsPage({
    searchParams,
}: {
    searchParams: Promise<{ difficulty?: string; track?: string; tag?: string; page?: string }>;
}) {
    const params = await searchParams;
    const difficulty = params.difficulty;
    const track = params.track;
    const tag = params.tag;
    const pageNum = parseInt(params.page || "1", 10);
    const pageSize = 25;

    // Build filter
    const where: any = { isPublished: true };
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (track) where.trackType = track.toUpperCase();
    if (tag) where.tags = { has: tag };

    const [problems, totalCount] = await Promise.all([
        prisma.problem.findMany({
            where,
            select: {
                id: true, title: true, slug: true, difficulty: true,
                platformSource: true, platformUrl: true, tags: true,
                trackType: true, rating: true,
            },
            orderBy: [{ trackType: "asc" }, { difficulty: "asc" }, { order: "asc" }],
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        }),
        prisma.problem.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    // Get user progress
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = token ? await getUser(token) : null;
    let solvedIds = new Set<string>();
    if (user) {
        const progress = await prisma.userProgress.findMany({
            where: { userId: user.id, status: "SOLVED" },
            select: { problemId: true }
        });
        solvedIds = new Set(progress.map(p => p.problemId));
    }

    // Get all unique tags for filter
    const allProblems = await prisma.problem.findMany({
        where: { isPublished: true },
        select: { tags: true },
    });
    const allTags = [...new Set(allProblems.flatMap(p => p.tags))].sort();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    <GradientText>All Problems</GradientText>
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                    {totalCount} problems available
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Filter className="h-4 w-4 text-text-muted" />

                {/* Difficulty Filter */}
                <div className="flex gap-1">
                    {["EASY", "MEDIUM", "HARD"].map(d => (
                        <Link
                            key={d}
                            href={`/problems?${new URLSearchParams({ ...(track ? { track } : {}), ...(tag ? { tag } : {}), ...(difficulty === d ? {} : { difficulty: d }) }).toString()}`}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${difficulty?.toUpperCase() === d
                                    ? DIFF_COLORS[d]
                                    : "bg-white/5 text-text-muted hover:bg-white/10"
                                }`}
                        >
                            {d.charAt(0) + d.slice(1).toLowerCase()}
                        </Link>
                    ))}
                </div>

                <div className="h-4 w-px bg-white/10" />

                {/* Track Filter */}
                <div className="flex gap-1">
                    {["DSA", "CP"].map(t => (
                        <Link
                            key={t}
                            href={`/problems?${new URLSearchParams({ ...(difficulty ? { difficulty } : {}), ...(tag ? { tag } : {}), ...(track === t ? {} : { track: t }) }).toString()}`}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${track?.toUpperCase() === t
                                    ? "text-accent-cyan bg-accent-cyan/10"
                                    : "bg-white/5 text-text-muted hover:bg-white/10"
                                }`}
                        >
                            {t}
                        </Link>
                    ))}
                </div>

                {(difficulty || track || tag) && (
                    <Link href="/problems" className="ml-2 text-xs text-red-400 hover:text-red-300">
                        Clear filters
                    </Link>
                )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, 20).map(t => (
                    <Link
                        key={t}
                        href={`/problems?${new URLSearchParams({ ...(difficulty ? { difficulty } : {}), ...(track ? { track } : {}), ...(tag === t ? {} : { tag: t }) }).toString()}`}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] transition-colors ${tag === t
                                ? "bg-accent-purple/20 text-accent-purple"
                                : "bg-white/5 text-text-muted hover:bg-white/8"
                            }`}
                    >
                        {t}
                    </Link>
                ))}
            </div>

            {/* Problems Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[40px_1fr_100px_100px_100px] gap-4 items-center px-4 py-2 bg-white/5 text-xs font-semibold uppercase text-text-muted tracking-wider">
                    <span></span>
                    <span>Title</span>
                    <span>Difficulty</span>
                    <span>Track</span>
                    <span>Platform</span>
                </div>

                {/* Rows */}
                {problems.map((problem, idx) => {
                    const isSolved = solvedIds.has(problem.id);
                    return (
                        <Link
                            key={problem.slug}
                            href={`/problems/${problem.slug}`}
                            className={`grid grid-cols-[40px_1fr_100px_100px_100px] gap-4 items-center px-4 py-3 text-sm transition-colors hover:bg-white/5 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                }`}
                        >
                            <div className="flex justify-center">
                                {isSolved ? (
                                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                                ) : (
                                    <Circle className="h-4 w-4 text-text-muted/30" />
                                )}
                            </div>
                            <span className="text-text-primary font-medium truncate">{problem.title}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-center ${DIFF_COLORS[problem.difficulty]}`}>
                                {problem.difficulty}
                            </span>
                            <span className="text-xs text-text-muted">{problem.trackType}</span>
                            <span className="text-xs text-text-muted">{problem.platformSource}</span>
                        </Link>
                    );
                })}

                {problems.length === 0 && (
                    <div className="flex h-32 items-center justify-center text-text-muted">
                        No problems match these filters
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Link
                            key={p}
                            href={`/problems?${new URLSearchParams({ ...(difficulty ? { difficulty } : {}), ...(track ? { track } : {}), ...(tag ? { tag } : {}), page: String(p) }).toString()}`}
                            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${p === pageNum
                                    ? "bg-accent-cyan text-black font-bold"
                                    : "bg-white/5 text-text-muted hover:bg-white/10"
                                }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
