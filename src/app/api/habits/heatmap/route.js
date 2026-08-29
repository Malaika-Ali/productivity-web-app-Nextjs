import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

function toLocalDateString(date) {
    const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Go back 6 calendar months, then snap backward to the most recent Sunday
        // so the grid's weeks align cleanly to calendar weeks, same as GitHub's graph.
        // Using setMonth() instead of a fixed day count (e.g. -180) because months
        // vary in length — this gives a true "6 months ago", not an approximation.
        const today = new Date()
        const roughStart = new Date()
        roughStart.setMonth(today.getMonth() - 6)
        const startDate = new Date(roughStart)
        startDate.setDate(startDate.getDate() - startDate.getDay()) // snap back to Sunday

        const startStr = toLocalDateString(startDate)
        const todayStr = toLocalDateString(today)

        const { data: habits, error } = await supabase
            .from("habits")
            .select("target_days, habit_completions(completed_on)")
            .eq("user_id", user.id)

        if (error) throw error

        // Build per-day scheduled/completed counts across ALL habits combined
        const dayStats = {} // { "2026-06-01": { scheduled: N, completed: N } }
        const cursor = new Date(startDate)
        while (toLocalDateString(cursor) <= todayStr) {
            dayStats[toLocalDateString(cursor)] = { scheduled: 0, completed: 0 }
            cursor.setDate(cursor.getDate() + 1)
        }

        for (const habit of habits || []) {
            const completedDates = new Set((habit.habit_completions || []).map(c => c.completed_on))
            for (const dateStr of Object.keys(dayStats)) {
                const dayIndex = new Date(dateStr).getDay()
                if (habit.target_days?.includes(dayIndex)) {
                    dayStats[dateStr].scheduled++
                    if (completedDates.has(dateStr)) dayStats[dateStr].completed++
                }
            }
        }

        // Convert each day's stats into a 0-3 level for the heatmap color scale
        const data = Object.entries(dayStats).map(([date, stats]) => {
            const rate = stats.scheduled > 0 ? stats.completed / stats.scheduled : 0
            let level = 0
            if (rate > 0.66) level = 3
            else if (rate > 0.33) level = 2
            else if (rate > 0) level = 1
            return { date, level }
        })

        return NextResponse.json({ success: true, data, startDate: startStr })
    } catch (error) {
        console.error("GET /api/habits/heatmap error:", error)
        return NextResponse.json({ error: "Failed to fetch heatmap data" }, { status: 500 })
    }
}