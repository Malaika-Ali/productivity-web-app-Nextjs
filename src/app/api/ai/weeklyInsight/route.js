import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/serverClient"
import { detectPatterns } from "@/lib/ai/insights/PatternDetection"
import { selectInsights } from "@/lib/ai/insights/InsightSelection"
import { generateInsight } from "@/lib/ai/insights/generateInsight"
import { getCurrentWeekStart } from "@/lib/ai/insights/weekwindow"


async function createWeeklyInsight(supabase, userId) {
    const { data: previousInsight, error: previousError } =
        await supabase
            .from("ai_insights")
            .select("pattern_type, habit_id, generated_at")
            .eq("user_id", userId)
            .order("generated_at", {
                ascending: false,
            })
            .limit(1)
            .maybeSingle()

    if (previousError) {
        console.error(
            "Error fetching previous insight:",
            previousError
        )
    }

    const patterns = await detectPatterns(
        supabase,
        userId
    )

    const selectedPatterns = selectInsights(
        patterns,
        previousInsight
    )

    const result = await generateInsight(
        selectedPatterns
    )

    return result
}


export async function GET() {
    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const weekStart = getCurrentWeekStart()

        const { data: cached, error: cacheError } =
            await supabase
                .from("ai_insights")
                .select(
                    "insight, recommendation, generated_at, pattern_type, confidence"
                )
                .eq("user_id", user.id)
                .eq("week_start_date", weekStart)
                .maybeSingle()

        if (cacheError) {
            throw cacheError
        }

        if (cached && cached.insight) {
            return NextResponse.json({
                ...cached,
                cached: true,
            })
        }

        const result = await createWeeklyInsight(
            supabase,
            user.id
        )

        const selectedPattern =
            result.selectedPattern || null

        const { data: saved, error: upsertError } =
            await supabase
                .from("ai_insights")
                .upsert(
                    {
                        user_id: user.id,
                        week_start_date: weekStart,
                        insight: result.insight,
                        recommendation:
                            result.recommendation,
                        pattern_type:
                            selectedPattern
                                ? selectedPattern.type
                                : null,
                        habit_id:
                            selectedPattern
                                ? selectedPattern.habitId
                                : null,
                        confidence:
                            selectedPattern
                                ? selectedPattern.confidence
                                : null,
                        stats_snapshot:
                            selectedPattern,
                        generated_at:
                            new Date().toISOString(),
                    },
                    {
                        onConflict:
                            "user_id,week_start_date",
                    }
                )
                .select(
                    "insight, recommendation, generated_at, pattern_type, confidence"
                )
                .single()

        if (upsertError) {
            throw upsertError
        }

        return NextResponse.json({
            ...saved,
            cached: false,
        })
    } catch (error) {
        console.error(
            "GET /api/ai/weeklyInsight error:",
            error
        )

        return NextResponse.json(
            {
                error: "Failed to generate insights",
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            {
                status: 500,
            }
        )
    }
}


export async function POST() {
    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const weekStart = getCurrentWeekStart()

        const result = await createWeeklyInsight(
            supabase,
            user.id
        )

        const selectedPattern =
            result.selectedPattern || null

        const { data: saved, error: upsertError } =
            await supabase
                .from("ai_insights")
                .upsert(
                    {
                        user_id: user.id,
                        week_start_date: weekStart,
                        insight: result.insight,
                        recommendation:
                            result.recommendation,
                        pattern_type:
                            selectedPattern
                                ? selectedPattern.type
                                : null,
                        habit_id:
                            selectedPattern
                                ? selectedPattern.habitId
                                : null,
                        confidence:
                            selectedPattern
                                ? selectedPattern.confidence
                                : null,
                        stats_snapshot:
                            selectedPattern,
                        generated_at:
                            new Date().toISOString(),
                    },
                    {
                        onConflict:
                            "user_id,week_start_date",
                    }
                )
                .select(
                    "insight, recommendation, generated_at, pattern_type, confidence"
                )
                .single()

        if (upsertError) {
            throw upsertError
        }

        return NextResponse.json({
            ...saved,
            cached: false,
        })
    } catch (error) {
        console.error(
            "POST /api/ai/weeklyInsight error:",
            error
        )

        return NextResponse.json(
            {
                error: "Failed to regenerate insights",
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            {
                status: 500,
            }
        )
    }
}