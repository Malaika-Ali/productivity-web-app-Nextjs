"use client";

import { Brain } from 'lucide-react';

import { Sparkles, RefreshCw, Lightbulb } from "lucide-react"
import { useInsights } from "@/hooks/useInsights"

export default function CoachNote(){
    const { insight, loading, refreshing, error, regenerate } = useInsights()
 
    return (
    <div className="bg-white rounded-3xl p-6 w-full border-2 border-b-8 border-gray-200">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-primary" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Your Weekly Insight</h2>
            </div>

            {!loading && (
                <button
                    onClick={regenerate}
                    disabled={refreshing}
                    aria-label="Regenerate insight"
                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors disabled:opacity-40"
                >
                    <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                </button>
            )}
        </div>

        {loading && <InsightSkeleton />}

        {!loading && error && (
            <p className="text-sm text-gray-400">
                Couldn't load your insight right now. Try refreshing in a moment.
            </p>
        )}

        {!loading && !error && insight && (
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {insight.summary}
                </p>

                <div className="flex flex-col gap-2.5">
                    {insight.suggestions.map((suggestion, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2.5 bg-gray-50/60 rounded-xl px-3.5 py-3"
                        >
                            <Lightbulb size={14} className="text-primary mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-600 leading-snug">{suggestion}</p>
                        </div>
                    ))}
                </div>
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