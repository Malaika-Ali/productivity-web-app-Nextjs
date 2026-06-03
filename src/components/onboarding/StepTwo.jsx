"use client";
import { useState } from "react";
import { Bot, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HABITS = [
    { id: "workout", emoji: "💪", label: "Workout 30 mins", frequency: "Daily" },
    { id: "meditate", emoji: "🧘🏽", label: "Morning Meditate", frequency: "Daily" },
    { id: "read", emoji: "📚", label: "Read 10 Pages", frequency: "Daily" },
    { id: "hydrate", emoji: "💧", label: "Hydrate 2L", frequency: "Daily" },
];

export default function StepTwo() {
    const [selected, setSelected] = useState([]);

    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
        );
    };

    const allSelected = selected.length === HABITS.length;

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 py-12"
            style={{
                background:
                    "radial-gradient(ellipse at 20% 50%, #1e1b4b 0%, #0f0e1a 40%, #13111f 100%)",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                <div
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
                    style={{ background: "radial-gradient(circle, #6d5aff, transparent)" }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
                    style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
                />
            </div>

            <div className="relative z-10 w-full max-w-xl flex flex-col gap-0">

                {/* ── Step indicator ── */}
                <div className="flex flex-col items-center mb-8 gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/40">
                            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span
                            className="text-2xl font-bold tracking-tight text-white"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Habitrea{" "}
                            <span className="text-violet-400 font-extrabold">AI</span>
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-2 mt-3 w-48">
                        <div className="h-1 flex-1 rounded-full bg-violet-500" />
                        <div className="h-1 flex-1 rounded-full bg-violet-500" />
                    </div>
                </div>

                {/* ── Main card ── */}
                <div
                    className="border border-white/10 rounded-t-3xl"
                    style={{
                        background: "linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.018) 100%)",
                        backdropFilter: "blur(24px)",
                    }}
                >
                    <div className="px-7 pt-7 pb-6 space-y-6">

                        {/* AI Chat Bubble */}
                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-md shadow-violet-900/50 mt-0.5">
                                <Bot className="w-5 h-5 text-white" strokeWidth={2} />
                            </div>
                            <div
                                className="rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed text-white/85 border border-white/10"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(109,90,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                                }}
                            >
                                Here&apos;s your starter habit plan,{" "}
                                <span className="font-bold text-violet-300">Ali</span>{" "}
                                <span role="img" aria-label="target">🎯</span>{" "}
                                I picked these based on your goals. Select the ones you want to start with — you can always add more later.
                            </div>
                        </div>

                        {/* Habit grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {HABITS.map((habit) => {
                                const active = selected.includes(habit.id);
                                return (
                                    <button
                                        key={habit.id}
                                        onClick={() => toggle(habit.id)}
                                        className={cn(
                                            "relative text-left rounded-2xl px-4 pt-4 pb-4 border transition-all duration-200 cursor-pointer group",
                                            active
                                                ? "border-violet-500/60 bg-violet-600/20 shadow-lg shadow-violet-900/30"
                                                : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06] hover:border-white/20"
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            className={cn(
                                                "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                                active
                                                    ? "border-violet-400 bg-violet-500"
                                                    : "border-white/20 bg-transparent group-hover:border-white/40"
                                            )}
                                        >
                                            {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                        </div>

                                        {/* Emoji */}
                                        <div className="text-3xl mb-2 leading-none">{habit.emoji}</div>

                                        {/* Label */}
                                        <p className={cn(
                                            "text-sm font-semibold mb-2 transition-colors",
                                            active ? "text-white" : "text-white/75"
                                        )}>
                                            {habit.label}
                                        </p>

                                        {/* Frequency badge */}
                                        <span
                                            className={cn(
                                                "inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium transition-all",
                                                active
                                                    ? "bg-violet-500/25 border-violet-400/40 text-violet-300"
                                                    : "bg-white/5 border-white/15 text-white/40"
                                            )}
                                        >
                                            {habit.frequency}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* ── Footer card ── */}
                <div
                    className="rounded-b-3xl border border-t-0 border-white/10 px-7 pt-5 pb-6 space-y-4"
                    style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.04) 100%)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Habit count badge */}
                    <div className="flex justify-center">
                        <div
                            className={cn(
                                "px-5 py-1.5 rounded-full text-sm font-medium border transition-all duration-300",
                                selected.length > 0
                                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                    : "bg-white/5 border-white/10 text-white/35"
                            )}
                        >
                            {selected.length === 0
                                ? "0 habits selected"
                                : `${selected.length} habit${selected.length > 1 ? "s" : ""} selected`}
                        </div>
                    </div>

                    {/* CTA */}
                    <Button
                        disabled={selected.length === 0}
                        className={cn(
                            "w-full h-14 rounded-2xl text-base font-semibold tracking-wide border-0",
                            "transition-all duration-300",
                            selected.length > 0
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/50 hover:scale-[1.01] cursor-pointer"
                                : "bg-white/8 text-white/25 cursor-not-allowed"
                        )}
                    >
                        Start my journey 🚀
                    </Button>
                </div>

            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
        </div>
    );
}