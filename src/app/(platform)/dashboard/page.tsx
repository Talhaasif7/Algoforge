import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { Target, Flame, Zap, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { COOKIES } from "@/lib/auth/constants";

async function getDashboardData(userId: string | null) {
  if (!userId) {
    return { totalSolved: 0, streak: 0, xp: 0, level: 1, recentSubmissions: [], heatmapData: [] };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, streak: true }
  });

  const totalSolved = await prisma.submission.groupBy({
    by: ["problemId"],
    where: { userId, status: "ACCEPTED" },
  });

  // Get submissions for heatmap (last 365 days)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const submissions = await prisma.submission.findMany({
    where: { userId, createdAt: { gte: oneYearAgo } },
    select: { createdAt: true, status: true },
    orderBy: { createdAt: "desc" }
  });

  // Build heatmap: count submissions per day
  const heatmapMap = new Map<string, number>();
  for (const sub of submissions) {
    const dateKey = sub.createdAt.toISOString().split("T")[0];
    heatmapMap.set(dateKey, (heatmapMap.get(dateKey) || 0) + 1);
  }
  const heatmapData = Array.from(heatmapMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Get recent accepted problems
  const recentSubmissions = await prisma.submission.findMany({
    where: { userId, status: "ACCEPTED" },
    include: { problem: { select: { title: true, slug: true, difficulty: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
    distinct: ["problemId"],
  });

  return {
    totalSolved: totalSolved.length,
    streak: user?.streak || 0,
    xp: user?.xp || 0,
    level: user?.level || 1,
    recentSubmissions,
    heatmapData,
  };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value;
  const user = token ? await getUser(token) : null;
  const data = await getDashboardData(user?.id || null);

  const stats = [
    { label: "Problems Solved", value: String(data.totalSolved), icon: Target, color: "text-accent-green", bg: "bg-accent-green/10" },
    { label: "Current Streak", value: `${data.streak} days`, icon: Flame, color: "text-accent-yellow", bg: "bg-accent-yellow/10" },
    { label: "Total XP", value: String(data.xp), icon: Zap, color: "text-accent-purple", bg: "bg-accent-purple/10" },
    { label: "Level", value: String(data.level), icon: TrendingUp, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome to <GradientText>AlgoForge</GradientText>
        </h1>
        <p className="mt-2 text-text-secondary">
          Track your progress and keep building momentum.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Activity Heatmap */}
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Activity Heatmap</h2>
        <ActivityHeatmap data={data.heatmapData} />
      </GlassCard>

      {/* Recently Solved */}
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Recently Solved</h2>
        {data.recentSubmissions.length > 0 ? (
          <div className="space-y-2">
            {data.recentSubmissions.map((sub: any) => (
              <a
                key={sub.id}
                href={`/problems/${sub.problem.slug}`}
                className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              >
                <span className="font-medium text-text-primary">{sub.problem.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.problem.difficulty === "EASY" ? "bg-accent-green/10 text-accent-green" :
                  sub.problem.difficulty === "MEDIUM" ? "bg-accent-yellow/10 text-accent-yellow" :
                    "bg-difficulty-hard/10 text-difficulty-hard"
                  }`}>
                  {sub.problem.difficulty}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-text-muted">
            Start solving to see your progress here
          </div>
        )}
      </GlassCard>
    </div>
  );
}
