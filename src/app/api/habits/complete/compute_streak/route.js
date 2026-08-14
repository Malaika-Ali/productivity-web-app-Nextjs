function toLocalDateString(date) {
    const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export async function IncrementStreak(supabase, habitId, userId) {
    const { data: habit, error: habitError } = await supabase
        .from('habits')
        .select('target_days', 'current_streak', 'longest_streak')
        .eq('id', habitId)
        .eq('user_id', userId)
        .single()

    if (habitError) throw habitError

    const todayIndex = new Date().getDay()

    // Not a scheduled day — bonus completion, streak untouched
    if (!habit.target_days?.includes(todayIndex)) {
        return { current_streak: habit.current_streak, longest_streak: habit.longest_streak }
    }

    // Walk backward to find the nearest PREVIOUS scheduled day (skipping unscheduled days)
    const cursor = new Date()
    cursor.setDate(cursor.getDate() - 1)
    let prevScheduledDate = null
    for (let i = 0; i < 3; i++) {
        if (habit.target_days.includes(cursor.getDay())) {
            prevScheduledDate = toLocalDateString(cursor)
            break
        }
        cursor.setDate(cursor.getDate() - 1)
    }

    let wasPreviousDayCompleted = false
    if (prevScheduledDate) {
        const { data: prevCompletion } = await supabase
            .from('habit_completion')
            .select('id')
            .eq('habit_id', habitId)
            .eq('completed_on', prevScheduledDate)
            .maybeSingle()
        if (prevCompletion) wasPreviousDayCompleted = true
    }


    const newStreak = wasPreviousDayCompleted ? habit.current_streak + 1 : 1
    const newLongest = Math.max(newStreak, (habit.longest_streak + 1) || 0)

    const { data: updated, streakUpdateError } = await supabase
        .from('habits')
        .update({ current_streak: newStreak, longest_streak: newLongest })
        .eq('id', habitId)
        .eq('user_id', userId)

    if (streakUpdateError) throw streakUpdateError

    return { current_streak: newStreak, longest_streak: newLongest }

}

