export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  constraints: string;
  examples: ProblemExample[];
  editorial: string | null;
  hints: string[] | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  trackType: "DSA" | "CP" | "INTERVIEW";
  topicId: string | null;
  subtopicId: string | null;
  platformSource: string | null;
  platformUrl: string | null;
  rating: number | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  boilerplate: Record<string, string> | null;
  isPublished: boolean;
  order: number | null;
  totalSubmissions: number;
  totalSolved: number;
  acceptanceRate: number | null;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  track: "DSA" | "CP" | "INTERVIEW";
  order: number;
  subtopics: Subtopic[];
  _count?: { problems: number };
}

export interface Subtopic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  _count?: { problems: number };
}

export interface ProblemFilters {
  track?: string;
  topicId?: string;
  subtopicId?: string;
  difficulty?: string | string[];
  tags?: string[];
  status?: "solved" | "attempted" | "unsolved";
  search?: string;
  page?: number;
  limit?: number;
}
