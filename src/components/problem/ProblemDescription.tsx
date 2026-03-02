"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProblemDescriptionProps {
    problem: any;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
    return (
        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">{problem.title}</h1>
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border",
                    problem.difficulty === "EASY" && "border-accent-green/20 bg-accent-green/10 text-accent-green",
                    problem.difficulty === "MEDIUM" && "border-accent-yellow/20 bg-accent-yellow/10 text-accent-yellow",
                    problem.difficulty === "HARD" && "border-difficulty-hard/20 bg-difficulty-hard/10 text-difficulty-hard"
                )}>
                    {problem.difficulty}
                </span>
            </div>

            {/* Quick Stats/Tags */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {problem.platformSource && (
                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-text-muted">
                        Platform: {problem.platformSource}
                    </span>
                )}
                {problem.timeComplexity && (
                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-text-muted">
                        O({problem.timeComplexity}) Time
                    </span>
                )}
            </div>

            {/* Description Body */}
            <div className="prose prose-invert max-w-none text-text-secondary">
                <div dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
            </div>

            {/* Examples */}
            {problem.examples && typeof problem.examples === 'object' && Object.keys(problem.examples).length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Examples</h3>
                    {(problem.examples as any[]).map((ex, i) => (
                        <div key={i} className="rounded-lg bg-white/5 p-4 border border-white/10">
                            <p className="font-mono text-sm">
                                <span className="text-text-muted">Input: </span>
                                <span className="text-text-primary">{ex.input}</span>
                            </p>
                            <p className="font-mono text-sm mt-2">
                                <span className="text-text-muted">Output: </span>
                                <span className="text-text-primary">{ex.output}</span>
                            </p>
                            {ex.explanation && (
                                <p className="font-mono text-sm mt-2 text-text-muted">
                                    Explanation: {ex.explanation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Constraints</h3>
                    <div className="rounded-lg bg-surface-card p-4 border border-white/10">
                        <ul className="list-inside list-disc space-y-1 font-mono text-sm text-text-secondary">
                            {problem.constraints.split('\n').map((c: string, idx: number) => (
                                <li key={idx}>{c}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
