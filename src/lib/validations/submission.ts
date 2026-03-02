import { z } from "zod";

export const runCodeSchema = z.object({
  problemId: z.string().min(1),
  code: z.string().min(1).max(65535),
  language: z.enum(["PYTHON", "CPP", "JAVA", "JAVASCRIPT"]),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
      })
    )
    .max(10)
    .optional(),
});

export const submitCodeSchema = z.object({
  problemId: z.string().min(1),
  code: z.string().min(1).max(65535),
  language: z.enum(["PYTHON", "CPP", "JAVA", "JAVASCRIPT"]),
});

export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
