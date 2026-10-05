import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/serverClient"
import { collectBehavioralData, buildBehaviorProfile } from "@/lib/ai/insights/BehavioralData"
import { detectPatterns } from "@/lib/ai/insights/PatternDetection"
import { selectInsights } from "@/lib/ai/insights/InsightSelection"
import { generateInsight } from "@/lib/ai/insights/generateInsight"
import { getCurrentWeekStart } from "@/lib/ai/insights/weekwindow"

export const dynamic = "force-dynamic"

async function getPreviousInsight(supabase, userId) {
    const { data, error } = await supabase
        .from("ai_insights")
        .select("pattern_type, habit_id, generated_at")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error("Previous insight lookup failed:", error)
        return null
    }

    return data || null
}

async function createWeeklyInsight(supabase, userId) {
    const previousInsight = await getPreviousInsight(
        supabase,
        userId
    )

    const rawData = await collectBehavioralData(
        supabase,
        userId
    )

    if (!rawData.habits.length) {
        return {
            insight:
                "Add a few habits and log them for a little while so Habitrea can learn how your routines behave.",
            whyItMatters:
                "The coach needs repeated behavior before it can identify meaningful patterns.",
            hypothesis:
                "There is not enough behavioral history yet.",
            recommendation:
                "Start by consistently logging the habits that matter most to your current goals.",
            experiment:
                "Log your selected habits for the next 7 days without changing your routine just for the experiment.",
            selectedPatternIndex: null,
            selectedPattern: null,
        }
    }

    const profile = buildBehaviorProfile(rawData)

    const patterns = detectPatterns(profile)

    const selectedPatterns = selectInsights(
        patterns,
        previousInsight
    )

    const result = await generateInsight(
        selectedPatterns
    )

    return {
        ...result,
        profile,
        patterns: selectedPatterns,
    }
}

async function saveInsight(supabase, userId, result, weekStart) {
    const selectedPattern =
        result.selectedPattern || null

    const statsSnapshot = {
        selectedPattern,
        candidates: result.patterns || [],
        coach: {
            whyItMatters: result.whyItMatters,
            hypothesis: result.hypothesis,
            experiment: result.experiment,
        },
    }

    const payload = {
        user_id: userId,
        week_start_date: weekStart,

        insight: result.insight,
        recommendation: result.recommendation,

        pattern_type: selectedPattern?.type || null,
        habit_id: selectedPattern?.habitId || null,
        confidence: selectedPattern?.confidence || null,

        stats_snapshot: statsSnapshot,
        generated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
        .from("ai_insights")
        .upsert(payload, {
            onConflict: "user_id,week_start_date",
        })
        .select(`
            insight,
            recommendation,
            generated_at,
            pattern_type,
            confidence,
            stats_snapshot
        `)
        .single()

    if (error) throw error

    return data
}

export async function GET() {
    return handleRequest({ regenerate: false })
}

export async function POST() {
    return handleRequest({ regenerate: true })
}

async function handleRequest({ regenerate }) {
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

        if (!regenerate) {
            const { data: cached, error } = await supabase
                .from("ai_insights")
                .select(`
                    insight,
                    recommendation,
                    generated_at,
                    pattern_type,
                    confidence,
                    stats_snapshot
                `)
                .eq("user_id", user.id)
                .eq("week_start_date", weekStart)
                .maybeSingle()

            if (error) throw error

            if (cached?.insight) {
                return NextResponse.json({
                    ...cached,
                    cached: true,
                })
            }
        }

        const result = await createWeeklyInsight(
            supabase,
            user.id
        )

        const saved = await saveInsight(
            supabase,
            user.id,
            result,
            weekStart
        )

        return NextResponse.json({
            ...saved,
            cached: false,
        })
    } catch (error) {
        console.error(
            "weeklyInsight error:",
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
            { status: 500 }
        )
    }
}
