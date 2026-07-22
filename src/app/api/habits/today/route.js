import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: "Unauthorized user" }, { status: 401 }
        )

        const today = new Date().toISOString().split('T')[0]  // "2026-07-20"
        const todayDayIndex = new Date().getDay()  // 0-6

        const { data: habits, error } = await supabase
            .from('habits')
            .select('*, habit_completions(id, completed_on)')
            .eq('user_id', user.id)
        //  .contains('target_days', [todayDayIndex])
        //  .filter('target_days', 'cs', `{${todayDayIndex}}`)

        if (error) throw error

        const todaysHabits = habits.filter(habit =>
            habit.target_days?.includes(todayDayIndex)
        )

        console.log("Todays habits are", todaysHabits)
        const completedToday = habits.map(habit => ({
            ...habit,
            completedToday: habit.habit_completions.some(log => log.completed_on === today)
        }))

        return NextResponse.json({ habits: todaysHabits, completedToday })

    } catch (error) {
        console.log("Internal server error", error)
        return NextResponse.json(
            { error: "Could not fetch today's scheduled habits, Internal Server Error" }, { status: 500 }
        )
    }

}