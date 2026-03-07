import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { Target, Flame, Zap, TrendingUp, Calendar, Award, Code2, Edit2 } from "lucide-react";
import { redirect } from "next/navigation";
import { COOKIES } from "@/lib/auth/constants";
import { ProfileContent } from "../../../components/profile/ProfileContent";

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
  const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value;
  const authUser = token ? await getUser(token) : null;

  if (!authUser || !token) {
    redirect("/login?redirect=/profile");
  }

  const data = await getProfileData(authUser.id);
  const user = data.user!;
  const joinDate = user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <ProfileContent
      initialData={data}
      user={user}
      joinDate={joinDate}
      token={token}
    />
  );
}
