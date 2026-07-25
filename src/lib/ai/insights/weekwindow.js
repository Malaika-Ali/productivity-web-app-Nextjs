// Returns "YYYY-MM-DD" for the Monday of the current week (local time).
// Used as the cache key: one insight row per user per week.
export function getCurrentWeekStart() {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diffToMonday)
    return toDateString(monday)
}

// Returns "YYYY-MM-DD" for N days ago (local time), used for the trailing stats window.
export function getDaysAgo(n) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return toDateString(d)
}

export function getToday() {
    return toDateString(new Date())
}

function toDateString(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

// Weekday index -> label, matches JS Date.getDay()
export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]