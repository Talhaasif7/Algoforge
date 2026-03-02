import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DifficultyBadgeProps {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  className?: string;
}

const difficultyConfig = {
  EASY: {
    label: "Easy",
    className: "bg-difficulty-easy/15 text-difficulty-easy border-difficulty-easy/30",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-difficulty-medium/15 text-difficulty-medium border-difficulty-medium/30",
  },
  HARD: {
    label: "Hard",
    className: "bg-difficulty-hard/15 text-difficulty-hard border-difficulty-hard/30",
  },
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  return (
    <Badge variant="outline" className={cn(config.className, "font-medium", className)}>
      {config.label}
    </Badge>
  );
}
