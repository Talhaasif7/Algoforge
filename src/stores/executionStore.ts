import { create } from "zustand";
import type { TestCaseResult, SubmissionStatus } from "@/types";

interface ExecutionState {
  isRunning: boolean;
  isSubmitting: boolean;
  results: TestCaseResult[];
  submissionStatus: SubmissionStatus | null;
  error: string | null;

  setRunning: (running: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setResults: (results: TestCaseResult[]) => void;
  setSubmissionStatus: (status: SubmissionStatus | null) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  isSubmitting: false,
  results: [],
  submissionStatus: null,
  error: null,

  setRunning: (isRunning) => set({ isRunning, error: null }),
  setSubmitting: (isSubmitting) => set({ isSubmitting, error: null }),
  setResults: (results) => set({ results, isRunning: false }),
  setSubmissionStatus: (submissionStatus) => set({ submissionStatus, isSubmitting: false }),
  setError: (error) => set({ error, isRunning: false, isSubmitting: false }),
  clearResults: () => set({ results: [], submissionStatus: null, error: null }),
}));
