import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { Trophy, Medal, Award } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

async function getLeaderboardData() {
  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 50,
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      streak: true,
      _count: {
        select: {
          submissions: { where: { status: "ACCEPTED" } }
        }
      }
    }
  });
  return users;
}

export default async function LeaderboardPage() {
  const users = await getLeaderboardData();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-text-muted w-5 text-center">{rank}</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <GradientText>Leaderboard</GradientText>
        </h1>
        <p className="mt-2 text-text-secondary">
          Top coders ranked by XP and problems solved.
        </p>
      </div>

      <GlassCard className="overflow-hidden p-0">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">User</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-1 text-center">Streak</div>
          <div className="col-span-2 text-center">Solved</div>
        </div>

        {/* Rows */}
        {users.length > 0 ? (
          users.map((user, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={user.id}
                className={`grid grid-cols-12 gap-4 items-center px-6 py-4 transition-colors hover:bg-white/5 ${rank <= 3 ? "bg-white/[0.02]" : ""
                  } ${rank < users.length ? "border-b border-white/5" : ""}`}
              >
                <div className="col-span-1 flex items-center">
                  {getRankIcon(rank)}
                </div>
                <div className="col-span-4">
                  <span className="font-semibold text-text-primary">{user.username}</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-sm font-bold text-accent-cyan">
                    Lv. {user.level}
                  </span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-mono text-sm font-bold text-accent-purple">{user.xp}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm text-accent-yellow">{user.streak}🔥</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-mono text-sm font-bold text-accent-green">{user._count.submissions}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-40 items-center justify-center text-text-muted">
            No users yet. Be the first to solve problems!
          </div>
        )}
      </GlassCard>
    </div>
  );
}
