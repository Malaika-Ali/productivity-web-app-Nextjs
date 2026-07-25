import { getDaysAgo, getToday, WEEKDAY_NAMES } from "./weekwindow"
// Pulls the last 7 days of habit + task activity for a user and reduces it
// into compact stats — this is what gets fed into the Gemini prompt.
// Keeping this as plain aggregated numbers (not raw rows) keeps the prompt
// short and keeps us from ever sending unnecessary raw data to a third-party API.
export async function aggregateWeeklyStats(supabase, userId) {
    const windowStart = getDaysAgo(6) // 7-day window inclusive of today
    const today = getToday()
    const [{ data: habits, error: habitsError }, { data: tasks, error: tasksError }] = await Promise.all([
        supabase
            .from("habits")
            .select("id, title, category, target_days, current_streak, longest_streak, habit_completions(completed_on)")
            .eq("user_id", userId),
        supabase
            .from("tasks")
            .select("id, title, priority, status, due_date")
            .eq("user_id", userId)
            .gte("due_date", windowStart)
            .lte("due_date", today),
    ])

    if (habitsError) throw habitsError
    if (tasksError) throw tasksError

    const windowDates = buildDateRange(windowStart, today)

    // ---- Habit stats ----
    const perHabit = (habits || []).map(habit => {
        const completedDates = new Set(
            (habit.habit_completions || [])
                .map(c => c.completed_on)
                .filter(d => d >= windowStart && d <= today)
        )

        let scheduled = 0
        let completed = 0
        for (const dateStr of windowDates) {
            const dayIndex = new Date(dateStr).getDay()
            if (habit.target_days?.includes(dayIndex)) {
                scheduled++
                if (completedDates.has(dateStr)) completed++
            }
        }

        return {
            title: habit.title,
            category: habit.category,
            scheduled,
            completed,
            completionRate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : null,
            current_streak: habit.current_streak,
            longest_streak: habit.longest_streak,
        }
    })

    // Weekday-level performance across ALL habits combined, to find the user's strongest/weakest day
    const weekdayTotals = WEEKDAY_NAMES.map(() => ({ scheduled: 0, completed: 0 }))
    for (const habit of habits || []) {
        const completedDates = new Set((habit.habit_completions || []).map(c => c.completed_on))
        for (const dateStr of windowDates) {
            const dayIndex = new Date(dateStr).getDay()
            if (habit.target_days?.includes(dayIndex)) {
                weekdayTotals[dayIndex].scheduled++
                if (completedDates.has(dateStr)) weekdayTotals[dayIndex].completed++
            }
        }
    }
    const weekdayPerformance = weekdayTotals
        .map((t, i) => ({
            day: WEEKDAY_NAMES[i],
            rate: t.scheduled > 0 ? Math.round((t.completed / t.scheduled) * 100) : null,
        }))
        .filter(w => w.rate !== null)

    const bestDay = weekdayPerformance.length
        ? weekdayPerformance.reduce((a, b) => (b.rate > a.rate ? b : a))
        : null
    const weakestDay = weekdayPerformance.length
        ? weekdayPerformance.reduce((a, b) => (b.rate < a.rate ? b : a))
        : null

    const totalScheduled = perHabit.reduce((sum, h) => sum + h.scheduled, 0)
    const totalCompleted = perHabit.reduce((sum, h) => sum + h.completed, 0)
    const overallHabitRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : null

    // ---- Task stats ----
    const totalTasks = (tasks || []).length
    const completedTasks = (tasks || []).filter(t => t.status === "completed").length
    const overdueTasks = (tasks || []).filter(t => t.status !== "completed" && t.due_date < today).length
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : null

    const tasksByPriority = ["high", "medium", "low"].map(priority => {
        const inPriority = (tasks || []).filter(t => t.priority === priority)
        const done = inPriority.filter(t => t.status === "completed").length
        return { priority, total: inPriority.length, completed: done }
    }).filter(p => p.total > 0)

    return {
        windowStart,
        windowEnd: today,
        habits: {
            list: perHabit,
            overallCompletionRate: overallHabitRate,
            bestDay,
            weakestDay,
        },
        tasks: {
            total: totalTasks,
            completed: completedTasks,
            overdue: overdueTasks,
            completionRate: taskCompletionRate,
            byPriority: tasksByPriority,
        },
    }
}

function buildDateRange(start, end) {
    const dates = []
    const cur = new Date(start)
    const endDate = new Date(end)
    while (cur <= endDate) {
        const y = cur.getFullYear()
        const m = String(cur.getMonth() + 1).padStart(2, "0")
        const d = String(cur.getDate()).padStart(2, "0")
        dates.push(`${y}-${m}-${d}`)
        cur.setDate(cur.getDate() + 1)
    }
    return dates
}