"use client";

import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TestCasesProps {
    testCases: any[];
    result: any;
}

export function TestCases({ testCases = [], result }: TestCasesProps) {
    const [activeTab, setActiveTab] = useState("testcases"); // "testcases" or "result"
    const [selectedTestCase, setSelectedTestCase] = useState(0);

    return (
        <div className="flex h-full flex-col">
            {/* Tabs */}
            <div className="flex h-10 flex-none border-b border-white/10 bg-surface-header">
                <button
                    onClick={() => setActiveTab("testcases")}
                    className={cn(
                        "px-4 text-sm font-medium transition-colors border-b-2",
                        activeTab === "testcases"
                            ? "border-accent-cyan text-accent-cyan bg-white/5"
                            : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5"
                    )}
                >
                    Test Cases
                </button>
                {result && (
                    <button
                        onClick={() => setActiveTab("result")}
                        className={cn(
                            "px-4 text-sm font-medium transition-colors border-b-2",
                            activeTab === "result"
                                ? "border-accent-cyan text-accent-cyan bg-white/5"
                                : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5"
                        )}
                    >
                        Result <span className={cn(
                            "ml-2 inline-flex h-2 w-2 rounded-full",
                            result.status === "ACCEPTED" ? "bg-accent-green" : "bg-difficulty-hard"
                        )} />
                    </button>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                {activeTab === "testcases" && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {testCases.map((tc, idx) => (
                                <button
                                    key={tc.id}
                                    onClick={() => setSelectedTestCase(idx)}
                                    className={cn(
                                        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                        selectedTestCase === idx
                                            ? "bg-white/10 text-text-primary"
                                            : "bg-surface-card text-text-muted hover:bg-white/5 hover:text-text-primary"
                                    )}
                                >
                                    Case {idx + 1}
                                </button>
                            ))}
                        </div>

                        {testCases[selectedTestCase] && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-xs font-semibold text-text-muted">Input</h4>
                                    <div className="rounded-md bg-surface-card border border-white/10 p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                                        {testCases[selectedTestCase].input}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2 text-xs font-semibold text-text-muted">Expected Output</h4>
                                    <div className="rounded-md bg-surface-card border border-white/10 p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                                        {testCases[selectedTestCase].expectedOutput}
                                    </div>
                                </div>
                            </div>
                        )}
                        {testCases.length === 0 && (
                            <div className="text-text-muted text-sm italic">No default test cases available.</div>
                        )}
                    </div>
                )}

                {activeTab === "result" && result && (
                    <div className="space-y-4">
                        <div className={cn(
                            "text-xl font-bold",
                            result.status === "ACCEPTED" ? "text-accent-green" : "text-difficulty-hard"
                        )}>
                            {result.status}
                        </div>
                        {result.output && (
                            <div>
                                <h4 className="mb-2 text-xs font-semibold text-text-muted">Console Output</h4>
                                <div className="rounded-md bg-black/50 border border-white/10 p-4 font-mono text-sm text-text-secondary whitespace-pre-wrap overflow-x-auto">
                                    {result.output}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
