import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { Target, Flame, Zap, TrendingUp, Calendar, Award, Code2 } from "lucide-react";
import { redirect } from "next/navigation";

async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      xp: true,
      level: true,
      streak: true,
      longestStreak: true,
      createdAt: true,
      _count: {
        select: {
          submissions: true,
        }
      }
    }
  });

  const solvedCount = await prisma.submission.groupBy({
    by: ["problemId"],
    where: { userId, status: "ACCEPTED" }
  });

  const difficultyBreakdown = await prisma.submission.findMany({
    where: { userId, status: "ACCEPTED" },
    select: { problem: { select: { difficulty: true } } },
    distinct: ["problemId"],
  });

  const easy = difficultyBreakdown.filter(s => s.problem.difficulty === "EASY").length;
  const medium = difficultyBreakdown.filter(s => s.problem.difficulty === "MEDIUM").length;
  const hard = difficultyBreakdown.filter(s => s.problem.difficulty === "HARD").length;

  const totalProblems = await prisma.problem.count({ where: { isPublished: true } });

  const recentSubmissions = await prisma.submission.findMany({
    where: { userId },
    include: { problem: { select: { title: true, slug: true, difficulty: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const languages = await prisma.submission.groupBy({
    by: ["language"],
    where: { userId },
    _count: { language: true },
    orderBy: { _count: { language: "desc" } }
  });

  return {
    user,
    solved: solvedCount.length,
    totalProblems,
    easy, medium, hard,
    recentSubmissions,
    languages,
  };
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authUser = token ? await getUser(token) : null;

  if (!authUser) {
    redirect("/login?redirect=/profile");
  }

  const data = await getProfileData(authUser.id);
  const user = data.user!;
  const joinDate = user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <GlassCard className="flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan text-3xl font-bold text-white flex-none">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
          <p className="text-sm text-text-muted">@{user.username}</p>
          {user.bio && <p className="mt-2 text-sm text-text-secondary">{user.bio}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {joinDate}</span>
            <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> {data.user?._count.submissions} submissions</span>
          </div>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Problems Solved", value: `${data.solved}/${data.totalProblems}`, icon: Target, color: "text-accent-green", bg: "bg-accent-green/10" },
          { label: "Current Streak", value: `${user.streak} days`, icon: Flame, color: "text-accent-yellow", bg: "bg-accent-yellow/10" },
          { label: "Total XP", value: String(user.xp), icon: Zap, color: "text-accent-purple", bg: "bg-accent-purple/10" },
          { label: "Level", value: String(user.level), icon: TrendingUp, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.label}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Difficulty Breakdown */}
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Solved by Difficulty</h2>
          <div className="space-y-3">
            {[
              { label: "Easy", count: data.easy, color: "bg-accent-green", track: "bg-accent-green/20" },
              { label: "Medium", count: data.medium, color: "bg-accent-yellow", track: "bg-accent-yellow/20" },
              { label: "Hard", count: data.hard, color: "bg-red-500", track: "bg-red-500/20" },
            ].map(d => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">{d.label}</span>
                  <span className="text-sm font-bold text-text-primary">{d.count}</span>
                </div>
                <div className={`h-2 rounded-full ${d.track}`}>
                  <div
                    className={`h-full rounded-full ${d.color} transition-all`}
                    style={{ width: data.solved > 0 ? `${(d.count / data.solved) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Languages */}
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Languages Used</h2>
          {data.languages.length > 0 ? (
            <div className="space-y-2">
              {data.languages.map(lang => (
                <div key={lang.language} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
                  <span className="text-sm font-medium text-text-primary">{lang.language}</span>
                  <span className="text-sm text-text-muted">{lang._count.language} submissions</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted italic">No submissions yet</p>
          )}
        </GlassCard>
      </div>

      {/* Recent Submissions */}
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Submissions</h2>
        {data.recentSubmissions.length > 0 ? (
          <div className="space-y-1">
            {data.recentSubmissions.map((sub: any) => (
              <a
                key={sub.id}
                href={`/problems/${sub.problem.slug}`}
                className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${sub.status === "ACCEPTED" ? "bg-accent-green" :
                      sub.status === "WRONG_ANSWER" ? "bg-red-500" :
                        "bg-accent-yellow"
                    }`} />
                  <span className="text-sm font-medium text-text-primary">{sub.problem.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sub.status === "ACCEPTED" ? "bg-accent-green/10 text-accent-green" :
                      sub.status === "WRONG_ANSWER" ? "bg-red-500/10 text-red-400" :
                        "bg-accent-yellow/10 text-accent-yellow"
                    }`}>
                    {sub.status.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-text-muted">{sub.language}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-text-muted">
            No submissions yet. Start solving problems!
          </div>
        )}
      </GlassCard>
    </div>
  );
}
