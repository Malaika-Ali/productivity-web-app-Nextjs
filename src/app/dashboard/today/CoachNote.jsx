"use client";

import { Brain } from 'lucide-react';

import { Sparkles, RefreshCw, Lightbulb } from "lucide-react"
import { useInsights } from "@/hooks/useInsights"

export default function CoachNote() {
    const { insight, loading, refreshing, error, regenerate } = useInsights()

    return (
        <div className="bg-purple-600 rounded-3xl overflow-hidden p-6 w-full text-violet-50 relative border-r-4 border-b-8 border-purple-800"
            style={{ borderRightWidth: '4px' }}>
         

            <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                    {/* Coach icon */}
                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <Brain color='white' fill='white' />
                    </div>
                    {/* <p className="text-[12px] font-extrabold tracking-wide text-purple-300 uppercase">
                        COACH
                       . 2 MIN Read
                    </p> */}
                    <h3 className="font-bold text-white leading-tight text-lg">A note from your AI coach</h3>
                </div>

                {/* {!loading && (
                    <button
                        onClick={regenerate}
                        disabled={refreshing}
                        aria-label="Regenerate insight"
                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors disabled:opacity-40"
                    >
                        <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                    </button>
                )} */}
            </div>

            {loading && <InsightSkeleton />}

            {!loading && error && (
                <p className="text-sm text-white">
                    Couldn't load your insight right now. Try refreshing in a moment.
                </p>
            )}

            {!loading && !error && insight && (
                <div className="flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-purple-100 z-100 mb-5">
                        {insight.insight}
                        {/* You have kept the morning run for 12 days, that's great. I noticed reading slips after 9 PM, so try to move it to 10 AM. */}
                    </p>
{/* suggestions */}
                    {/* <div className="flex flex-col gap-2.5">
                        {insight.suggestions.map((suggestion, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-2.5 bg-gray-50/60 rounded-xl px-3.5 py-3"
                            >
                                <Lightbulb size={14} className="text-primary mt-0.5 shrink-0" />
                                <p className="text-sm text-gray-600 font-normal">{suggestion}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
            )}
        </div>
    )
}

function InsightSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-3.5 bg-gray-100 rounded-full w-full" />
            <div className="h-3.5 bg-gray-100 rounded-full w-4/5" />
            <div className="h-12 bg-gray-50 rounded-xl mt-2" />
            <div className="h-12 bg-gray-50 rounded-xl" />
        </div>
    )
}