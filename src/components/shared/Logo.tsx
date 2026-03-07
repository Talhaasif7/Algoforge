"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: number;
    showText?: boolean;
}

export function Logo({ className, size = 32, showText = false }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
            <div className="relative flex items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105 active:scale-95">
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 p-1.5"
                >
                    <defs>
                        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Main geometric A */}
                    <path
                        d="M50 15L85 85H70L50 45L30 85H15L50 15Z"
                        fill="url(#logo-grad)"
                        className="drop-shadow-[0_4px_12px_rgba(168,85,247,0.3)]"
                    />

                    {/* Modern crossbar spark */}
                    <path
                        d="M40 60H60"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{ filter: "url(#logo-glow)" }}
                    />

                    {/* Accent node */}
                    <circle cx="50" cy="45" r="4" fill="white" className="animate-pulse" />
                </svg>

                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {showText && (
                <span className="text-xl font-black tracking-tight text-white transition-opacity duration-300 group-hover:opacity-100 opacity-90">
                    Algo<span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">Forge</span>
                </span>
            )}
        </div>
    );
}
