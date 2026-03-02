"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, SkipForward, SkipBack, ChevronFirst, ChevronLast, Gauge, X } from "lucide-react";

interface VisualizerStep {
    step: number;
    line: number;
    event: string;
    function: string;
    variables: Record<string, { value: any; type: string }>;
    callStack: string[];
    stdout: string;
    returnValue?: any;
    error?: string;
}

interface VisualizerPanelProps {
    code: string;
    language: string;
    input?: string;
    onClose: () => void;
}

export function VisualizerPanel({ code, language, input, onClose }: VisualizerPanelProps) {
    const [steps, setSteps] = useState<VisualizerStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [error, setError] = useState<string | null>(null);
    const [finalOutput, setFinalOutput] = useState("");
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

    // Fetch trace on mount
    useEffect(() => {
        const fetchTrace = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/visualizer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, language, input: input || "" })
                });
                const data = await res.json();
                if (data.error && data.steps?.length === 0) {
                    setError(`${data.error.type}: ${data.error.message}`);
                } else {
                    setSteps(data.steps || []);
                    setFinalOutput(data.finalOutput || "");
                    if (data.error) {
                        setError(`${data.error.type}: ${data.error.message}`);
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrace();
    }, [code, language, input]);

    // Auto-play
    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, speed, steps.length]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const step = steps[currentStep];
    const codeLines = code.split("\n");

    if (!mounted) return null;

    const content = (
        <div
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
            className="flex flex-col"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

            {/* Modal container */}
            <div className="relative z-10 flex flex-col m-4 rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden" style={{ height: "calc(100vh - 32px)" }}>
                {/* Header */}
                <div className="flex h-11 flex-none items-center justify-between border-b border-white/10 bg-[#161b22] px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                            <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="ml-2 text-sm font-semibold text-accent-cyan">⚡ Code Visualizer</span>
                        <span className="text-xs text-gray-500">
                            {steps.length > 0 ? `Step ${currentStep + 1} of ${steps.length}` : "Loading..."}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin h-8 w-8 border-2 border-accent-cyan border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-sm text-gray-300">Tracing your code line by line...</p>
                            <p className="text-xs text-gray-500 mt-1">Python only • Max 500 steps</p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {!isLoading && (
                    <div className="flex flex-1 min-h-0">
                        {/* Code Panel */}
                        <div className="w-[50%] border-r border-white/10 overflow-auto bg-[#0d1117]">
                            <div className="font-mono text-[13px] leading-[22px]">
                                {codeLines.map((line, idx) => {
                                    const lineNum = idx + 1;
                                    const isActive = step && step.line === lineNum;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex transition-colors duration-150 ${isActive
                                                    ? "bg-yellow-500/15 border-l-[3px] border-yellow-400"
                                                    : "border-l-[3px] border-transparent hover:bg-white/[0.03]"
                                                }`}
                                        >
                                            <span className={`w-12 text-right pr-4 select-none flex-none text-xs leading-[22px] ${isActive ? "text-yellow-400" : "text-gray-600"}`}>
                                                {lineNum}
                                            </span>
                                            <pre className={`whitespace-pre ${isActive ? "text-gray-100" : "text-gray-400"}`}>
                                                {line || " "}
                                            </pre>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Panels */}
                        <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
                            {/* Variables */}
                            <div className="flex-1 min-h-0 overflow-auto border-b border-white/10 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                                    <h3 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest">Variables</h3>
                                </div>
                                {step && Object.keys(step.variables).length > 0 ? (
                                    <div className="space-y-1.5">
                                        {Object.entries(step.variables).map(([name, info]) => (
                                            <div key={name} className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2 border border-white/[0.06]">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[13px] font-bold text-blue-400">{name}</span>
                                                    <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-gray-500">{info.type}</span>
                                                </div>
                                                <span className="font-mono text-[13px] text-green-400 max-w-[55%] truncate text-right">
                                                    {JSON.stringify(info.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600 italic">No variables in scope</p>
                                )}
                            </div>

                            {/* Call Stack */}
                            <div className="h-20 flex-none overflow-auto border-b border-white/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                    <h3 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest">Call Stack</h3>
                                </div>
                                {step && step.callStack.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {step.callStack.map((fn, i) => (
                                            <span key={i} className="rounded bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 text-[11px] font-mono text-purple-300">
                                                {fn}()
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[11px] text-gray-600 italic">&lt;module&gt;</span>
                                )}
                            </div>

                            {/* Output */}
                            <div className="h-28 flex-none overflow-auto p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                    <h3 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest">Output</h3>
                                </div>
                                <pre className="font-mono text-[13px] text-gray-300 whitespace-pre-wrap bg-black/30 rounded-md p-2 min-h-[2rem]">
                                    {step?.stdout || finalOutput || ""}
                                </pre>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex-none border-t border-red-500/20 bg-red-500/5 px-4 py-2">
                                    <p className="text-[12px] font-mono text-red-400">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Playback Controls */}
                {!isLoading && (
                    <div className="flex h-12 flex-none items-center justify-center gap-3 border-t border-white/10 bg-[#161b22] px-4">
                        <button onClick={() => setCurrentStep(0)} disabled={steps.length === 0}
                            className="rounded p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-20">
                            <ChevronFirst className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                            className="rounded p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-20">
                            <SkipBack className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={steps.length === 0}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-cyan text-black transition-transform hover:scale-110 disabled:opacity-20"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>
                        <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep >= steps.length - 1}
                            className="rounded p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-20">
                            <SkipForward className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCurrentStep(steps.length - 1)} disabled={steps.length === 0}
                            className="rounded p-1.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-20">
                            <ChevronLast className="h-4 w-4" />
                        </button>

                        <div className="mx-3 h-5 w-px bg-white/10" />

                        {/* Speed */}
                        <div className="flex items-center gap-2 text-gray-500">
                            <Gauge className="h-3.5 w-3.5" />
                            <input
                                type="range"
                                min={100} max={2000} step={100}
                                value={2100 - speed}
                                onChange={(e) => setSpeed(2100 - Number(e.target.value))}
                                className="h-1 w-20 accent-accent-cyan"
                            />
                            <span className="text-[11px] w-10 text-gray-500">{speed}ms</span>
                        </div>

                        <div className="mx-3 h-5 w-px bg-white/10" />

                        {/* Progress */}
                        <div className="h-1 flex-1 max-w-[200px] rounded-full bg-white/5">
                            <div
                                className="h-full rounded-full bg-accent-cyan/70 transition-all duration-200"
                                style={{ width: steps.length > 0 ? `${((currentStep + 1) / steps.length) * 100}%` : "0%" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
