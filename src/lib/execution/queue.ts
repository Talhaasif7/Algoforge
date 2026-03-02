import { redis } from "../cache/redis";

export const SUBMISSION_QUEUE_KEY = "queue:submissions";

export interface ExecutionJob {
  submissionId: string;
  problemId: string;
  code: string;
  language: "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT";
  type: "SUBMIT" | "RUN";
  userId: string;
  // For 'RUN' type, we can optionally pass custom test cases
  customTestCases?: { input: string; expectedOutput: string }[];
}

/**
 * Pushes a new execution job to the Redis queue.
 */
export async function enqueueJob(job: ExecutionJob): Promise<void> {
  await redis.lpush(SUBMISSION_QUEUE_KEY, JSON.stringify(job));
}

/**
 * Blocks until a job is available in the queue, then pops and returns it.
 * Uses BRPOP for efficient blocking.
 *
 * @param timeoutSeconds - How long to block before returning null (default 0 = indefinitely)
 */
export async function dequeueJob(timeoutSeconds: number = 0): Promise<ExecutionJob | null> {
  // brpop returns an array: [key, value]
  const result = await redis.brpop(SUBMISSION_QUEUE_KEY, timeoutSeconds);
  if (!result || result.length < 2) return null;

  try {
    return JSON.parse(result[1]) as ExecutionJob;
  } catch (err) {
    console.error("Failed to parse job from queue", err);
    return null;
  }
}
