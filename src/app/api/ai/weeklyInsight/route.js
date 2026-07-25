import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/serverClient"
import { aggregateWeeklyStats } from "@/lib/ai/insights/Aggregatestats"
import { generateInsight } from "@/lib/ai/insights/generateInsight"
import { getCurrentWeekStart } from "@/lib/ai/insights/weekwindow"

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: "Unauthorized" }, { status: 401 }
        )

        const weekStart = getCurrentWeekStart()

        // 1. Check cache — one insight per user per week
        const { data: cached, error: cacheError } = await supabase
            .from("ai_insights")
            .select("summary, suggestions, generated_at")
            .eq("user_id", user.id)
            .eq("week_start_date", weekStart)
            .maybeSingle()

        if (cacheError) throw cacheError

        if (cached) {
            return NextResponse.json({ ...cached, cached: true })
        }

        // 2. No cached insight for this week — generate a fresh one
        const stats = await aggregateWeeklyStats(supabase, user.id)
        const insight = await generateInsight(stats)

        const { data: saved, error: insertError } = await supabase
            .from("ai_insights")
            .insert({
                user_id: user.id,
                week_start_date: weekStart,
                summary: insight.summary,
                suggestions: insight.suggestions,
                stats_snapshot: stats,
            })
            .select("summary, suggestions, generated_at")
            .single()

        if (insertError) throw insertError

        return NextResponse.json({ ...saved, cached: false })

    } catch (error) {
        console.error("GET /api/insights error:", error)
        return NextResponse.json(
            { error: "Failed to generate insights" }, { status: 500 }
        )
    }
}

// Lets the user force a regeneration this week (e.g. a "Refresh" button),
// bypassing the cache. Same logic, but deletes any existing row for this week first.
export async function POST(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: "Unauthorized" }, { status: 401 }
        )

        const weekStart = getCurrentWeekStart()

        const stats = await aggregateWeeklyStats(supabase, user.id)
        const insight = await generateInsight(stats)

        const { data: saved, error: upsertError } = await supabase
            .from("ai_insights")
            .upsert({
                user_id: user.id,
                week_start_date: weekStart,
                summary: insight.summary,
                suggestions: insight.suggestions,
                stats_snapshot: stats,
                generated_at: new Date().toISOString(),
            }, { onConflict: "user_id,week_start_date" })
            .select("summary, suggestions, generated_at")
            .single()

        if (upsertError) throw upsertError

        return NextResponse.json({ ...saved, cached: false })

    } catch (error) {
        console.error("POST /api/insights error:", error)
        return NextResponse.json(
            { error: "Failed to regenerate insights" }, { status: 500 }
        )
    }
}