import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const topicName = topic
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <GradientText>{topicName}</GradientText>
        </h1>
        <p className="mt-2 text-text-secondary">
          Problems will appear here once the database is seeded.
        </p>
      </div>

      <GlassCard>
        <div className="flex h-40 items-center justify-center text-text-muted">
          No problems available yet. Seed the database to populate this track.
        </div>
      </GlassCard>
    </div>
  );
}
