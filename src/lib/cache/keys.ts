// ─── Cache key conventions ──────────────────────────────────
// Format: <namespace>:<entity>:<identifier>[:<sub-key>]

export const CACHE_KEYS = {
  // Problems
  problemBySlug: (slug: string) => `problem:slug:${slug}`,
  problemList: (filtersHash: string) => `problem:list:${filtersHash}`,
  featuredProblems: () => `problem:featured:daily`,

  // Topics
  allTopics: () => `topic:all`,
  topicBySlug: (slug: string) => `topic:slug:${slug}`,

  // User stats
  userStats: (userId: string) => `user:stats:${userId}`,
  userProgress: (userId: string) => `user:progress:${userId}`,

  // Leaderboard
  leaderboard: (track: string, timeframe: string) => `leaderboard:${track}:${timeframe}`,

  // Rate limiting
  rateLimit: (userId: string, endpoint: string) => `ratelimit:${userId}:${endpoint}`,

  // Submissions
  submissionResult: (submissionId: string) => `submission:result:${submissionId}`,
} as const;

export const CACHE_TTL = {
  problemBySlug: 600,      // 10 min
  problemList: 300,        // 5 min
  featuredProblems: 86400, // 24 hours
  allTopics: 3600,         // 1 hour
  userStats: 120,          // 2 min
  leaderboard: 600,        // 10 min
  submissionResult: 300,   // 5 min
} as const;
