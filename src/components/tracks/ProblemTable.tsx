"use client";

import { TrackProblem } from "./TrackAccordion";
import { CheckCircle2, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProblemTableProps {
    problems: TrackProblem[];
}

export function ProblemTable({ problems }: ProblemTableProps) {
    if (problems.length === 0) {
        return <div className="text-sm text-text-muted italic pl-4">No problems in this section yet.</div>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-white/5 bg-surface-card">
            <table className="w-full text-left text-sm text-text-secondary">
                <thead className="bg-white/5 text-xs uppercase text-text-muted">
                    <tr>
                        <th className="px-4 py-3 w-12 text-center">Status</th>
                        <th className="px-4 py-3">Problem</th>
                        <th className="px-4 py-3 w-32">Difficulty</th>
                        <th className="px-4 py-3 w-24 text-center">Solve</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {problems.map((prob) => (
                        <tr key={prob.id} className="transition-colors hover:bg-white/5">
                            <td className="px-4 py-3 text-center">
                                {prob.isSolved ? (
                                    <CheckCircle2 className="mx-auto h-5 w-5 text-accent-green" />
                                ) : (
                                    <div className="mx-auto h-4 w-4 rounded-full border border-white/20" />
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <Link
                                    href={`/problems/${prob.slug}`}
                                    className="font-medium text-text-primary hover:text-accent-cyan transition-colors"
                                >
                                    {prob.title}
                                </Link>
                                {prob.platformSource && (
                                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                                        <span>{prob.platformSource}</span>
                                        {prob.platformUrl && (
                                            <a
                                                href={prob.platformUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:text-accent-cyan flex"
                                            >
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span className={cn(
                                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                    prob.difficulty === "EASY" && "bg-accent-green/10 text-accent-green ring-accent-green/20",
                                    prob.difficulty === "MEDIUM" && "bg-accent-yellow/10 text-accent-yellow ring-accent-yellow/20",
                                    prob.difficulty === "HARD" && "bg-difficulty-hard/10 text-difficulty-hard ring-difficulty-hard/20"
                                )}>
                                    {prob.rating ? `${prob.rating}` : prob.difficulty}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <Link href={`/problems/${prob.slug}`}>
                                    <button className="inline-flex h-8 items-center justify-center rounded-md bg-accent-cyan/10 px-3 text-xs font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/20">
                                        <Code2 className="h-4 w-4" />
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
