"use client";

import Editor from "@monaco-editor/react";
import { Play, Send, Eye } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const LANGUAGES = [
    { value: "JAVASCRIPT", label: "JavaScript" },
    { value: "PYTHON", label: "Python 3" },
    { value: "CPP", label: "C++" },
    { value: "JAVA", label: "Java" },
];

const LANGUAGE_MAP: Record<string, string> = {
    JAVASCRIPT: "javascript",
    PYTHON: "python",
    CPP: "cpp",
    JAVA: "java"
};

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
    language: string;
    onLanguageChange: (lang: string) => void;
    problem: any;
    onRun: () => void;
    onSubmit: () => void;
    onVisualize?: () => void;
    isRunning: boolean;
}

export function CodeEditor({
    code,
    onChange,
    language,
    onLanguageChange,
    problem,
    onRun,
    onSubmit,
    onVisualize,
    isRunning
}: CodeEditorProps) {

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        onLanguageChange(newLang);
        // Load boilerplate if available and code is unmodified or empty
        if (!code || (problem.boilerplate && problem.boilerplate[language] === code)) {
            onChange(problem.boilerplate?.[newLang] || "");
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex h-12 flex-none items-center justify-between border-b border-white/10 bg-surface-header px-4">
                <div className="flex items-center gap-4">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="rounded-md border border-white/15 bg-black px-3 py-1.5 text-sm text-text-primary outline-none transition-colors hover:border-white/25 focus:border-accent-cyan cursor-pointer"
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.value} value={l.value} className="bg-black text-white">
                                {l.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    {onVisualize && (
                        <button
                            onClick={onVisualize}
                            disabled={isRunning}
                            className="flex items-center gap-2 rounded-md bg-accent-purple/10 px-4 py-1.5 text-sm font-medium text-accent-purple transition-colors hover:bg-accent-purple/20 disabled:opacity-50"
                        >
                            <Eye className="h-4 w-4" />
                            Visualize
                        </button>
                    )}
                    <button
                        onClick={onRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-white/10 disabled:opacity-50"
                    >
                        <Play className="h-4 w-4 text-accent-green" />
                        Run
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isRunning}
                        className="flex items-center gap-2 rounded-md bg-accent-cyan px-4 py-1.5 text-sm font-bold text-surface-base transition-colors hover:bg-accent-cyan/90 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        Submit
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={LANGUAGE_MAP[language]}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => onChange(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        bracketPairColorization: { enabled: true },
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        formatOnPaste: true,
                    }}
                    loading={<div className="flex h-full items-center justify-center text-text-muted">Loading Editor...</div>}
                />
            </div>
        </div>
    );
}
