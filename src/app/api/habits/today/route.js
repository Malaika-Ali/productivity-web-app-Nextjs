import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

function toKarachiDateString(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Karachi',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date)
    const y = parts.find(p => p.type === 'year').value
    const m = parts.find(p => p.type === 'month').value
    const d = parts.find(p => p.type === 'day').value
    return `${y}-${m}-${d}`
}

function dayOfWeekFromDateString(dateStr) {
    return new Date(dateStr + 'T00:00:00Z').getUTCDay()
}

function addDaysToDateString(dateStr, delta) {
    const d = new Date(dateStr + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + delta)
    const y = d.getUTCFullYear(), m = String(d.getUTCMonth() + 1).padStart(2, "0"), day = String(d.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

function getCurrentDisplayStreak(habit, todayStr) {
    const targetDays = habit.target_days || []
    const completedDates = new Set((habit.habit_completions || []).map(c => c.completed_on))


    if (targetDays.includes(dayOfWeekFromDateString(todayStr)) && completedDates.has(todayStr)) {
        return habit.current_streak || 0
    }

    let cursorStr = addDaysToDateString(todayStr, -1)
    let prevCompleted = false
    for (let i = 0; i < 400; i++) {
        if (targetDays.includes(dayOfWeekFromDateString(cursorStr))) {
            prevCompleted = completedDates.has(cursorStr)
            break
        }
        cursorStr = addDaysToDateString(cursorStr, -1)
    }

    return prevCompleted ? (habit.current_streak || 0) : 0
}

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: "Unauthorized user" }, { status: 401 }
        )

        const today = toKarachiDateString() // Karachi's actual calendar date, regardless of server timezone
        const todayDayIndex = dayOfWeekFromDateString(today)

        const { data: habits, error } = await supabase
            .from('habits')
            .select('*, habit_completions(id, completed_on)')
            .eq('user_id', user.id)

        if (error) throw error

        const todaysHabits = habits.filter(habit =>
            habit.target_days?.includes(todayDayIndex)
        )

        const completedToday = todaysHabits.map(habit => ({
            ...habit,
            completedToday: habit.habit_completions.some(log => log.completed_on === today),
            current_streak: getCurrentDisplayStreak(habit, today)
        }))

        return NextResponse.json({ habits: todaysHabits, completedToday})

    } catch (error) {
        console.error("GET /api/habits/today error:", error)
        return NextResponse.json(
            { error: "Could not fetch today's scheduled habits, Internal Server Error" }, { status: 500 }
        )
    }
}