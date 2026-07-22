export function parseTime(timeStr) {
    if (!timeStr) return { hour: "07", minute: "30", period: "AM" }

    // Handle 24-hour format from DB: "10:00:00" or "14:30:00"
    const dbMatch = timeStr.match(/^(\d{2}):(\d{2}):\d{2}$/)
    if (dbMatch) {
        const hour24 = parseInt(dbMatch[1])
        const minute = dbMatch[2]
        const period = hour24 >= 12 ? "PM" : "AM"
        const hour12 = hour24 % 12 || 12
        return {
            hour: String(hour12).padStart(2, "0"),
            minute,
            period
        }
    }

    // Handle display format: "10:00 AM"
    const displayMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (displayMatch) {
        return {
            hour: String(displayMatch[1]).padStart(2, "0"),
            minute: displayMatch[2],
            period: displayMatch[3].toUpperCase()
        }
    }

    return { hour: "07", minute: "30", period: "AM" }
}