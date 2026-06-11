"use client";

import { useState } from "react";
import { Bot, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const GOALS = [
    { id: "fitness", label: "💪 Get fit" },
    { id: "learn", label: "📚 Learn something new" },
    { id: "productive", label: "🧠 Be more productive" },
    { id: "sleep", label: "😴 Sleep better" },
    { id: "screentime", label: "📵 Less screen time" },
    { id: "custom", label: "✏️ Custom..." },
];

export default function StepOne({ onComplete, userName, onHabitsGenerated }) {
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [customText, setCustomText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const canSubmit = selectedGoals.length > 0 || customText.trim().length > 0

    const toggleGoal = (label) => {
        setSelectedGoals((prev) =>
            prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
        );
    };

    function buildGoalsString() {
        const parts = []
        if (selectedGoals.length > 0) {
            parts.push(selectedGoals.join(', '))
        }
        if (customText.trim()) {
            parts.push(customText.trim())
        }
        return parts.join('. ')
    }

    const handleGenerate = async() => {
        // setLoading(true);
        // setTimeout(() => setLoading(false), 2000);
        // onComplete();
        if (!canSubmit) return
        setLoading(true)
        setError('Define your goals to continue')

        try {
            const goals = buildGoalsString()
            const res = await fetch('/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goals, userName })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            // Pass habits up to parent — parent switches to step 2
            onHabitsGenerated(data.habits)
            onComplete()
        } catch (err) {
            setError('Something went wrong. Please try again.', err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 py-12 font-sans"
            style={{
                background:
                    "radial-gradient(ellipse at 20% 50%, #1e1b4b 0%, #0f0e1a 40%, #13111f 100%)",
            }}
        >
            {/* Ambient glow blobs */}
            <div
                className="pointer-events-none fixed inset-0 overflow-hidden"
                aria-hidden
            >
                <div
                    className="absolute -top-32 -left-32 w-125 h-125 rounded-full opacity-20 blur-3xl"
                    style={{ background: "radial-gradient(circle, #6d5aff, transparent)" }}
                />
                <div
                    className="absolute bottom-0 right-0 w-100 h-100 rounded-full opacity-15 blur-3xl"
                    style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
                />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                {/* Header */}
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
                        <div className="h-1 flex-1 rounded-full bg-white/15" />
                    </div>
                </div>

                {/* Main card */}
                <div
                    className="rounded-3xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                        backdropFilter: "blur(24px)",
                    }}
                >
                    <div className="p-7 space-y-7">
                        {/* AI Chat Bubble */}
                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-md shadow-violet-900/50 mt-0.5">
                                <Bot className="w-5 h-5 text-white" strokeWidth={2} />
                            </div>
                            <div
                                className="rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed text-white/90 border border-white/10"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(109,90,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                                }}
                            >
                                Hey Ali!{" "}
                                <span role="img" aria-label="wave">
                                    👋
                                </span>{" "}
                                I&apos;m your personal AI coach. I&apos;m here to help you build
                                habits that actually stick and tasks that actually get done. What
                                are you trying to improve in your life right now?
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/8" />

                        {/* Goal chips */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase">
                                Select your goals
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {GOALS.map((goal) => {
                                    const active = selectedGoals.includes(goal.label);
                                    return (
                                        <button
                                            key={goal.id}
                                            onClick={() => toggleGoal(goal.label)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer select-none",
                                                active
                                                    ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40 scale-[1.03]"
                                                    : "bg-white/5 border-white/12 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white"
                                            )}
                                        >
                                            {goal.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Optional textarea */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase">
                                Or tell me more{" "}
                                <span className="normal-case font-normal text-white/25">
                                    (optional)
                                </span>
                            </p>
                            <Textarea
                                placeholder="e.g I want to build a consistent workout routine and start meditation to reduce stressafter work..."
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                rows={4}
                                className={cn(
                                    "w-full resize-none rounded-2xl px-4 py-3.5 text-sm",
                                    "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25",
                                    "focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30",
                                    "transition-all duration-200"
                                )}
                            />
                        </div>

                        {/* CTA */}
                        <Button
                            onClick={handleGenerate}
                            disabled={loading || (selectedGoals.length === 0 && !customText.trim())}
                            className={cn(
                                "w-full h-14 rounded-2xl text-base font-semibold tracking-wide",
                                "bg-gradient-to-r from-violet-600 to-indigo-600",
                                "hover:from-violet-500 hover:to-indigo-500",
                                "shadow-lg shadow-violet-900/50",
                                "transition-all duration-300 hover:shadow-violet-700/40 hover:scale-[1.01]",
                                "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
                                "text-white border-0 cursor-pointer"
                            )}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Building your plan...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Generate my habit plan
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>

                        {/* Footer note */}
                        <p className="text-center text-xs text-white/25">
                            {selectedGoals.length > 0
                                ? `${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} selected`
                                : "Select at least one goal to continue"}
                        </p>
                    </div>
                </div>

                {/* Skip link */}
                <p className="text-center mt-5 text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer">
                    Skip for now
                </p>
            </div>

        </div>
    );
}