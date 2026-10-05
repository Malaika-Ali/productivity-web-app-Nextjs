import { getDaysAgo, getToday, WEEKDAY_NAMES } from "./weekwindow"

const WINDOW_DAYS = 60

export async function collectBehavioralData(supabase, userId) {
    if (!supabase) throw new Error("Supabase client is required")
    if (!userId) throw new Error("User ID is required")

    const startDate = getDaysAgo(WINDOW_DAYS - 1)
    const endDate = getToday()

    const [
        { data: habits, error: habitsError },
        { data: tasks, error: tasksError },
    ] = await Promise.all([
        supabase
            .from("habits")
            .select(`
                id,
                title,
                category,
                target_days,
                preferred_time,
                current_streak,
                longest_streak
            `)
            .eq("user_id", userId),

        supabase
            .from("tasks")
            .select(`
                id,
                priority,
                status,
                due_date
            `)
            .eq("user_id", userId)
            .gte("due_date", startDate)
            .lte("due_date", endDate),
    ])

    if (habitsError) throw habitsError
    if (tasksError) throw tasksError

    const safeHabits = habits || []
    const habitIds = safeHabits.map((habit) => habit.id)

    let completions = []

    if (habitIds.length > 0) {
        const { data, error } = await supabase
            .from("habit_completions")
            .select("habit_id, completed_on")
            .in("habit_id", habitIds)
            .gte("completed_on", startDate)
            .lte("completed_on", endDate)

        if (error) throw error
        completions = data || []
    }

    const dates = buildDateRange(startDate, endDate)

    const completionSets = new Map()

    for (const habit of safeHabits) {
        completionSets.set(
            habit.id,
            new Set(
                completions
                    .filter((c) => c.habit_id === habit.id)
                    .map((c) => normalizeDate(c.completed_on))
            )
        )
    }

    const daily = dates.map((date) => {
        const dayIndex = new Date(`${date}T12:00:00`).getDay()

        const habitStates = {}

        for (const habit of safeHabits) {
            const scheduled = isHabitScheduledForDay(habit, dayIndex)
            const completed =
                completionSets.get(habit.id)?.has(date) || false

            habitStates[habit.id] = {
                scheduled,
                completed: scheduled ? completed : false,
            }
        }

        const dueTasks = (tasks || []).filter(
            (task) => normalizeDate(task.due_date) === date
        )

        const completedTasks = dueTasks.filter(
            (task) => task.status === "completed"
        ).length

        return {
            date,
            dayIndex,
            dayName: WEEKDAY_NAMES[dayIndex],
            habits: habitStates,
            taskLoad: dueTasks.length,
            completedTasks,
        }
    })

    return {
        window: {
            start: startDate,
            end: endDate,
            days: dates.length,
        },
        habits: safeHabits,
        completions,
        tasks: tasks || [],
        daily,
    }
}

export function buildBehaviorProfile(data) {
    const { habits, daily } = data

    const habitProfiles = habits.map((habit) => {
        const rows = daily
            .map((day) => ({
                date: day.date,
                dayIndex: day.dayIndex,
                dayName: day.dayName,
                ...day.habits[habit.id],
            }))
            .filter((row) => row.scheduled)

        const completed = rows.filter((row) => row.completed).length

        return {
            id: habit.id,
            title: habit.title,
            category: habit.category,
            preferredTime: habit.preferred_time,
            currentStreak: Number(habit.current_streak || 0),
            longestStreak: Number(habit.longest_streak || 0),
            rows,
            scheduled: rows.length,
            completed,
            completionRate: rate(completed, rows.length),
            recentRate: periodRate(rows, 6),
            previousRate: periodRate(rows, 13, 7),
            fourWeekRate: periodRate(rows, 27),
        }
    })

    return {
        window: data.window,
        habits: habitProfiles,
        daily,
    }
}

function periodRate(rows, lastDays, offset = 0) {
    const selected = rows.slice(-lastDays - 1, offset ? -offset : undefined)
    if (!selected.length) return null
    return rate(
        selected.filter((row) => row.completed).length,
        selected.length
    )
}

function rate(completed, total) {
    if (!total) return null
    return Math.round((completed / total) * 100)
}

function buildDateRange(start, end) {
    const dates = []
    const current = new Date(`${start}T12:00:00`)
    const endDate = new Date(`${end}T12:00:00`)

    while (current <= endDate) {
        dates.push(formatDate(current))
        current.setDate(current.getDate() + 1)
    }

    return dates
}

function isHabitScheduledForDay(habit, dayIndex) {
    if (!Array.isArray(habit.target_days) || habit.target_days.length === 0) {
        return true
    }

    return habit.target_days.includes(dayIndex)
}

function normalizeDate(value) {
    if (!value) return ""
    if (typeof value === "string" && value.length >= 10) {
        return value.slice(0, 10)
    }

    return formatDate(new Date(value))
}

function formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}
