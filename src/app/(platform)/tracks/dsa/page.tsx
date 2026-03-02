import { GradientText } from "@/components/shared/GradientText";
import { TrackAccordion } from "@/components/tracks/TrackAccordion";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export const revalidate = 60;

export default async function DSATrackPage() {
  const topics = await prisma.topic.findMany({
    where: { track: "DSA" },
    orderBy: { order: "asc" },
    include: {
      subtopics: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            select: {
              id: true, title: true, slug: true,
              difficulty: true, platformSource: true,
              platformUrl: true, rating: true,
            }
          }
        }
      },
      // Also get problems linked directly to the topic (no subtopic)
      problems: {
        where: { isPublished: true, subtopicId: null },
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, slug: true,
          difficulty: true, platformSource: true,
          platformUrl: true, rating: true,
        }
      }
    }
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? await getUser(token) : null;

  let solvedProblemIds = new Set<string>();
  if (user) {
    const progress = await prisma.userProgress.findMany({
      where: { userId: user.id, status: "SOLVED" },
      select: { problemId: true }
    });
    solvedProblemIds = new Set(progress.map(p => p.problemId));
  }

  // Merge topic-level problems into a virtual "Problems" subtopic
  const topicsWithProgress = topics.map(topic => {
    const subtopics = topic.subtopics.map(subtopic => ({
      ...subtopic,
      problems: subtopic.problems.map(problem => ({
        ...problem,
        isSolved: solvedProblemIds.has(problem.id)
      }))
    }));

    // Add topic-level problems as a virtual subtopic if any exist
    if (topic.problems.length > 0) {
      subtopics.push({
        id: `${topic.id}-direct`,
        name: "Problems",
        slug: "problems",
        description: null,
        problems: topic.problems.map(problem => ({
          ...problem,
          isSolved: solvedProblemIds.has(problem.id)
        }))
      } as any);
    }

    return { ...topic, subtopics };
  });

  // Filter out topics with no problems at all
  const nonEmptyTopics = topicsWithProgress.filter(
    t => t.subtopics.some(s => s.problems.length > 0)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <GradientText>DSA Track: Striver&apos;s A2Z</GradientText>
        </h1>
        <p className="mt-2 text-text-secondary">
          Master Data Structures & Algorithms with structured, topic-wise learning.
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <TrackAccordion topics={nonEmptyTopics} />
      </div>
    </div>
  );
}
