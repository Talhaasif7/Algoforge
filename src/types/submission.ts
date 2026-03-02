export type SubmissionLanguage = "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT";

export type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "INTERNAL_ERROR";

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  testsPassed: number;
  testsTotal: number;
  errorMessage: string | null;
  failedTestCase: FailedTestCase | null;
  createdAt: string;
}

export interface FailedTestCase {
  input: string;
  expectedOutput: string;
  actualOutput: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
}

export interface ExecutionResult {
  status: SubmissionStatus;
  results: TestCaseResult[];
  compilationError?: string;
  totalTime: number;
}
