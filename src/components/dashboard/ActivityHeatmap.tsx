"use client";

interface HeatmapProps {
    data: { date: string; count: number }[];
}

export function ActivityHeatmap({ data }: HeatmapProps) {
    // Build a lookup map
    const countMap = new Map<string, number>();
    for (const d of data) {
        countMap.set(d.date, d.count);
    }

    // Generate last 365 days
    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        days.push({
            date: dateStr,
            count: countMap.get(dateStr) || 0,
            dayOfWeek: d.getDay(),
        });
    }

    // Group into weeks (columns)
    const weeks: typeof days[] = [];
    let currentWeek: typeof days = [];
    for (const day of days) {
        if (day.dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(day);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const getColor = (count: number) => {
        if (count === 0) return "bg-white/5";
        if (count <= 2) return "bg-accent-green/30";
        if (count <= 5) return "bg-accent-green/50";
        if (count <= 10) return "bg-accent-green/70";
        return "bg-accent-green";
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="overflow-x-auto">
            {/* Month labels */}
            <div className="flex gap-[3px] mb-1 ml-8">
                {weeks.map((week, wi) => {
                    const firstDay = week[0];
                    const d = new Date(firstDay.date);
                    const showMonth = d.getDate() <= 7;
                    return (
                        <div key={wi} className="w-[13px] flex-none">
                            {showMonth && (
                                <span className="text-[10px] text-text-muted">{months[d.getMonth()]}</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-start gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-[3px] mr-1">
                    {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                        <div key={i} className="h-[13px] text-[10px] text-text-muted leading-[13px]">
                            {label}
                        </div>
                    ))}
                </div>
                {/* Grid */}
                <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                            {/* Pad first week if it doesn't start on Sunday */}
                            {wi === 0 && Array.from({ length: week[0].dayOfWeek }).map((_, i) => (
                                <div key={`pad-${i}`} className="h-[13px] w-[13px]" />
                            ))}
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    className={`h-[13px] w-[13px] rounded-sm ${getColor(day.count)} transition-colors hover:ring-1 hover:ring-white/30`}
                                    title={`${day.date}: ${day.count} submissions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* Legend */}
            <div className="mt-3 flex items-center gap-1 justify-end text-[10px] text-text-muted">
                <span>Less</span>
                <div className="h-[10px] w-[10px] rounded-sm bg-white/5" />
                <div className="h-[10px] w-[10px] rounded-sm bg-accent-green/30" />
                <div className="h-[10px] w-[10px] rounded-sm bg-accent-green/50" />
                <div className="h-[10px] w-[10px] rounded-sm bg-accent-green/70" />
                <div className="h-[10px] w-[10px] rounded-sm bg-accent-green" />
                <span>More</span>
            </div>
        </div>
    );
}
