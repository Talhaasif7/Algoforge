"use client";

import Link from "next/link";
import { ArrowRight, Code2, Eye, BarChart3, Zap, Layers, Cpu, Globe, LogOut, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/shared/GradientText";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { GlassCard } from "@/components/shared/GlassCard";
import { VisualHero } from "@/components/landing/VisualHero";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Topic-Wise Tracks",
    description: "Master DSA with curated sheets for Arrays, Trees, Dynamic Programming, and more.",
    color: "bg-blue-500/20 text-blue-400",
    tag: "Structured",
    details: "Our tracks are meticulously crafted to take you from fundamentals to advanced concepts. Each problem is part of a larger narrative, ensuring you understand the 'why' behind every algorithm.",
    benefits: [
      "Curated by Competitive Programming experts",
      "Progressive difficulty scaling",
      "Company-specific interview patterns",
      "Real-world problem applications"
    ]
  },
  {
    icon: Eye,
    title: "Visual Debugging",
    description: "Step through your algorithms line-by-line and watch the state change in real-time.",
    color: "bg-cyan-500/20 text-cyan-400",
    tag: "Exclusive",
    details: "Stop guessing why your code fails. Our visual debugger provides a bird's-eye view of your data structures as they evolve, making complex concepts like Recursion or Dynamic Programming crystal clear.",
    benefits: [
      "Live tree and graph visualization",
      "Variable state change timeline",
      "Step-by-step execution control",
      "Memory leak detection assistance"
    ]
  },
  {
    icon: Zap,
    title: "Local Speed",
    description: "Run your code directly on your machine with zero latency using local compilers.",
    color: "bg-yellow-500/20 text-yellow-400",
    tag: "Native",
    details: "Experience true performance. Unlike cloud-based platforms, we leverage your local hardware for compilation, providing instant feedback and allowing you to work offline or with massive datasets.",
    benefits: [
      "Zero-latency code execution",
      "Native C++, Java, and Python support",
      "Bypass browser-based runtime limits",
      "Infinite loops safety guards"
    ]
  },
  {
    icon: BarChart3,
    title: "Global Stats",
    description: "Compare your performance on the global leaderboard and track your daily streaks.",
    color: "bg-purple-500/20 text-purple-400",
    tag: "Competitive",
    details: "Algorithms are a sport. Track your progress with detailed analytics, compare your solving speed with the community, and stay motivated with our daily streak system designed for consistency.",
    benefits: [
      "Global Percentile rankings",
      "Solving speed performance charts",
      "Category-wise skill mapping",
      "Consistency streak rewards"
    ]
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Complete support for Python, C++, Java, and JavaScript with high-performance runtimes.",
    color: "bg-green-500/20 text-green-400",
    tag: "Flexible",
    details: "Speak your language. Whether you're a Python enthusiast or a C++ purist, our platform provides first-class support for the latest versions and standard libraries of all major languages.",
    benefits: [
      "Modern C++20 support",
      "Latest Python 3.12 runtimes",
      "Java 21 environment",
      "Direct Node.js execution"
    ]
  },
  {
    icon: Layers,
    title: "Bento Layout",
    description: "A professional coding environment with resizable panels and VS Code quality editor.",
    color: "bg-pink-500/20 text-pink-400",
    tag: "Premium",
    details: "Your workspace, your rules. Inspired by the best IDs, our Bento-style layout allows you to arrange your coding environment exactly how you like it for maximum focus and productivity.",
    benefits: [
      "Fully resizable panel system",
      "Advanced VS Code engine editor",
      "Multiple theme support",
      "Integrated productivity tools"
    ]
  },
];

const stats = [
  { label: "Algorithms", value: "200+" },
  { label: "Daily Users", value: "5k+" },
  { label: "Solve Rate", value: "98%" },
  { label: "Tracks", value: "10+" },
];

export default function LandingPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      logout();
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Vertical Stripes Pattern - Thinner and more subtle */}
        <div className="absolute inset-0 flex opacity-[0.015]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-full flex-1 border-r border-white shadow-[1px_0_0_rgba(255,255,255,0.05)]" />
          ))}
        </div>

        {/* Ambient Glows - Refined for minimalism */}
        <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-purple/10 blur-[140px] -translate-x-1/2" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-accent-purple/10 blur-[140px] translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-1/2 bg-accent-cyan/5 blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-[#020617]/80 px-8 py-4 backdrop-blur-xl">
        <Link href="/">
          <Logo size={40} showText />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/tracks/dsa" className="hover:text-white transition-colors">DSA Tracks</Link>
          <Link href="/tracks/cp" className="hover:text-white transition-colors">CP Sheets</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Rankings</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-semibold hover:text-white transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan text-[10px] font-bold text-white group-hover:ring-2 ring-accent-purple/30 transition-all overflow-hidden shadow-lg">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {user.name}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">Log in</Link>
              <Link href="/register">
                <Button className="bg-white text-[#020617] hover:bg-slate-200 rounded-full font-bold px-6 border-none shadow-xl transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[90vh] flex-col lg:flex-row items-center justify-center px-8 lg:px-20 pt-24 pb-24 lg:pb-32 gap-12 overflow-hidden">
        <div className="max-w-2xl text-center lg:text-left flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-accent-cyan mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
              The Future of Competitive Programming
            </div>
            <h1 className="text-6xl lg:text-[110px] font-black leading-[0.95] tracking-tight text-white mb-10">
              Forge Your <br />
              <div className="relative inline-block py-2">
                <GradientText>Algorithm</GradientText>
                {/* Extra Curvy Double Underline SVG */}
                <svg
                  className="absolute -bottom-6 left-0 w-[110%] -left-[5%] h-8 overflow-visible"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M 2,10 Q 25,2 50,10 Q 75,18 98,10"
                    fill="transparent"
                    stroke="currentColor"
                    className="text-accent-purple/40"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 5,14 Q 30,6 55,14 Q 80,22 95,14"
                    fill="transparent"
                    stroke="currentColor"
                    className="text-accent-purple"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1.8, ease: "easeInOut" }}
                  />
                </svg>
              </div> Prowess
            </h1>
            <p className="max-w-xl text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed mx-auto lg:mx-0 font-medium">
              A premium playground for developers. Combine structured learning with real-time visual debugging to master complex data structures.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-accent-purple to-accent-cyan text-white border-none rounded-xl h-14 px-8 font-black shadow-2xl shadow-accent-purple/20 transition-all hover:brightness-110">
                  START PRACTICING NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tracks/dsa">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-14 px-8 font-bold backdrop-blur-lg">
                  Explore Tracks
                </Button>
              </Link>
            </div>

            {/* Stats Row - Enhanced Spacing & Dividers */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-y-12 sm:gap-0 pt-12 border-t border-white/5 relative">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`relative px-8 sm:px-12 flex flex-col items-center sm:items-start ${idx !== stats.length - 1 ? 'sm:border-r sm:border-white/5' : ''
                    }`}
                >
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight">{stat.value}</div>
                  <div className="text-[10px] lg:text-[11px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-2 whitespace-nowrap">{stat.label}</div>

                  {/* Subtle Glow for first/last stat if needed or just kept clean */}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full flex justify-center lg:justify-end"
        >
          <VisualHero />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-8 py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Everything you need to <GradientText>Dominate</GradientText>
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                We've built a world-class environment designed to make complex concepts feel intuitive, fast, and visual.
              </p>
            </div>
            {/* Redesigned Premium Social Proof Pill */}
            <div className="flex items-center gap-4 bg-[#0A0D14]/80 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-xl shadow-2xl">
              <div className="flex -space-x-2.5">
                <div className="h-7 w-7 rounded-full border border-[#0A0D14] bg-[#3B82F6]" />
                <div className="h-7 w-7 rounded-full border border-[#0A0D14] bg-[#06B6D4]" />
                <div className="h-7 w-7 rounded-full border border-[#0A0D14] bg-[#2563EB]" />
                <div className="h-7 w-7 rounded-full border border-[#0A0D14] bg-[#EC4899]" />
              </div>
              <div className="text-xs font-black text-white/90 tracking-tight">
                5,000+ Devs Joined
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedFeature(feature)}
                  className="cursor-pointer group relative p-px"
                >
                  {/* Plus Corners */}
                  <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-20 text-white/20 group-hover:text-accent-cyan/60 transition-colors">
                    <Plus size={16} strokeWidth={1} />
                  </div>
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-20 text-white/20 group-hover:text-accent-cyan/60 transition-colors">
                    <Plus size={16} strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 z-20 text-white/20 group-hover:text-accent-cyan/60 transition-colors">
                    <Plus size={16} strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 z-20 text-white/20 group-hover:text-accent-cyan/60 transition-colors">
                    <Plus size={16} strokeWidth={1} />
                  </div>

                  {/* Card Content */}
                  <div className="relative h-full border border-white/5 bg-[#020617] p-10 lg:p-12 transition-all duration-500 hover:bg-white/[0.02] flex flex-col items-start gap-8">
                    {/* Glowing Icon */}
                    <div className="relative">
                      <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${feature.color.replace('text-', 'bg-')}`} />
                      <div className={`relative p-4 rounded-2xl bg-white/5 border border-white/10 transition-transform group-hover:scale-110 group-hover:-rotate-3 ${feature.color}`}>
                        <Icon className="h-8 w-8 filter drop-shadow-[0_0_8px_currentColor]" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded-sm border border-white/5">
                          {feature.tag}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight">{feature.title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-3 text-sm font-black text-slate-600 group-hover:text-accent-cyan transition-all uppercase tracking-widest">
                      Explore Details
                      <div className="h-px w-8 bg-slate-800 group-hover:w-12 group-hover:bg-accent-cyan transition-all" />
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative group p-14 lg:p-24 bg-[#0A0D14] border border-white/5 rounded-[48px] text-center overflow-hidden">
            {/* Intense Atmospheric Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-accent-purple/15 to-transparent blur-[140px] pointer-events-none opacity-60" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-12">
              <h2 className="text-6xl lg:text-[88px] font-black text-white leading-[0.9] tracking-tighter">
                Ready to <span className="text-[#6366F1]">Forge</span> <br /> Your Future?
              </h2>
              <p className="text-slate-400 text-lg lg:text-2xl font-medium max-w-2xl opacity-70 leading-relaxed">
                Join thousands of developers mastering algorithms and cracking <br className="hidden lg:block" /> interviews with the world's most visual coding platform.
              </p>

              <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto mt-4">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-slate-50 rounded-full h-18 px-14 text-sm font-black tracking-[0.15em] uppercase transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.25)]">
                  {user ? "CONTINUE YOUR JOURNEY" : "CREATE YOUR ACCOUNT — IT'S FREE"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#010309] px-8 py-12 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-20 lg:mb-32">
          <div className="select-none pointer-events-none">
            <h2 className="text-[clamp(4rem,20vw,16rem)] font-black leading-none tracking-[-0.08em] text-[#3B3445] opacity-40 uppercase">
              ALGOFORGE
            </h2>
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left relative z-10">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Logo size={32} showText />
            </Link>
            <p className="text-slate-500 text-sm font-medium">
              Elevating the standard of technical interview preparation.
            </p>
          </div>

          <div className="flex justify-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Tracks</Link>
            <Link href="#" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4 text-center md:text-right">
            <div className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} AlgoForge. All rights reserved.
            </div>
            <div className="flex gap-4 justify-center md:justify-end text-xs text-slate-600">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="sm:max-w-[700px] bg-[#020617] border-white/5 text-slate-200 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden p-0 rounded-3xl">
          {selectedFeature && (
            <div className="relative p-8 lg:p-12 overflow-hidden">
              {/* Dynamic Background Glow */}
              <div className={`absolute -top-24 -right-24 h-64 w-64 blur-[100px] opacity-20 rounded-full transition-colors duration-700 ${selectedFeature.color}`} />
              <div className={`absolute -bottom-24 -left-24 h-64 w-64 blur-[100px] opacity-10 rounded-full transition-colors duration-700 ${selectedFeature.color}`} />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Floating Icon Container */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`p-6 rounded-[2.5rem] shadow-2xl ${selectedFeature.color} shrink-0 bg-opacity-30 backdrop-blur-xl border border-white/10`}
                  >
                    <selectedFeature.icon className="h-12 w-12" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      {selectedFeature.tag}
                    </div>
                    <DialogTitle className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                      {selectedFeature.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xl font-medium leading-relaxed">
                      {selectedFeature.description}
                    </DialogDescription>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Deep Dive Section */}
                  <div className="lg:col-span-3 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">The Deep Dive</h4>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <p className="text-slate-300 text-lg leading-relaxed font-medium relative z-10">
                        {selectedFeature.details}
                      </p>
                    </div>
                  </div>

                  {/* High-Impact Benefits */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Key Highlights</h4>
                    <div className="flex flex-col gap-3">
                      {selectedFeature.benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all hover:translate-x-1 group cursor-default"
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${selectedFeature.color.replace('text-', 'bg-').replace('400', '500').replace('/20', '/10')}`}>
                            <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                          </div>
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-slate-500 text-sm font-medium">Ready to start your journey?</p>
                  <Button
                    onClick={() => setSelectedFeature(null)}
                    className="w-full sm:w-auto bg-white text-[#020617] hover:bg-slate-200 font-extrabold rounded-2xl h-14 px-12 text-lg shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95"
                  >
                    CLOSE EXPLORER
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
