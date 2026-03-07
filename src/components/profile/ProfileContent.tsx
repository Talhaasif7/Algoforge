"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Target, Flame, Zap, TrendingUp, Calendar, Code2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileForm } from "./EditProfileForm";

interface ProfileContentProps {
    initialData: any;
    user: any;
    joinDate: string;
    token: string;
}

export function ProfileContent({ initialData, user, joinDate, token }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6">
            {isEditing ? (
                <EditProfileForm
                    user={user}
                    onCancel={() => setIsEditing(false)}
                    token={token}
                />
            ) : (
                <GlassCard className="flex items-start gap-6 relative group">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>

                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan text-3xl font-bold text-white flex-none overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
                        <p className="text-sm text-text-muted">@{user.username}</p>
                        {user.bio && <p className="mt-2 text-sm text-text-secondary">{user.bio}</p>}
                        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {joinDate}</span>
                            <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> {user._count.submissions} submissions</span>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Problems Solved", value: `${initialData.solved}/${initialData.totalProblems}`, icon: Target, color: "text-accent-green", bg: "bg-accent-green/10" },
                    { label: "Current Streak", value: `${user.streak} days`, icon: Flame, color: "text-accent-yellow", bg: "bg-accent-yellow/10" },
                    { label: "Total XP", value: String(user.xp), icon: Zap, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                    { label: "Level", value: String(user.level), icon: TrendingUp, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
                ].map(stat => {
                    const Icon = stat.icon;
                    return (
                        <GlassCard key={stat.label} className="flex items-center gap-4">
                            <div className={`rounded-xl p-3 ${stat.bg}`}>
                                <Icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                                <p className="text-xs text-text-secondary">{stat.label}</p>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Difficulty Breakdown */}
                <GlassCard>
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">Solved by Difficulty</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Easy", count: initialData.easy, color: "bg-accent-green", track: "bg-accent-green/20" },
                            { label: "Medium", count: initialData.medium, color: "bg-accent-yellow", track: "bg-accent-yellow/20" },
                            { label: "Hard", count: initialData.hard, color: "bg-red-500", track: "bg-red-500/20" },
                        ].map(d => (
                            <div key={d.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-text-secondary">{d.label}</span>
                                    <span className="text-sm font-bold text-text-primary">{d.count}</span>
                                </div>
                                <div className={`h-2 rounded-full ${d.track}`}>
                                    <div
                                        className={`h-full rounded-full ${d.color} transition-all`}
                                        style={{ width: initialData.solved > 0 ? `${(d.count / initialData.solved) * 100}%` : "0%" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Languages */}
                <GlassCard>
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">Languages Used</h2>
                    {initialData.languages.length > 0 ? (
                        <div className="space-y-2">
                            {initialData.languages.map((lang: any) => (
                                <div key={lang.language} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
                                    <span className="text-sm font-medium text-text-primary">{lang.language}</span>
                                    <span className="text-sm text-text-muted">{lang._count.language} submissions</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted italic">No submissions yet</p>
                    )}
                </GlassCard>
            </div>

            {/* Recent Submissions */}
            <GlassCard>
                <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Submissions</h2>
                {initialData.recentSubmissions.length > 0 ? (
                    <div className="space-y-1">
                        {initialData.recentSubmissions.map((sub: any) => (
                            <a
                                key={sub.id}
                                href={`/problems/${sub.problem.slug}`}
                                className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${sub.status === "ACCEPTED" ? "bg-accent-green" :
                                        sub.status === "WRONG_ANSWER" ? "bg-red-500" :
                                            "bg-accent-yellow"
                                        }`} />
                                    <span className="text-sm font-medium text-text-primary">{sub.problem.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sub.status === "ACCEPTED" ? "bg-accent-green/10 text-accent-green" :
                                        sub.status === "WRONG_ANSWER" ? "bg-red-500/10 text-red-400" :
                                            "bg-accent-yellow/10 text-accent-yellow"
                                        }`}>
                                        {sub.status.replace("_", " ")}
                                    </span>
                                    <span className="text-[11px] text-text-muted">{sub.language}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-24 items-center justify-center text-text-muted">
                        No submissions yet. Start solving problems!
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
