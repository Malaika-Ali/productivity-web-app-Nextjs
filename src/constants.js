export const CATEGORIES = ["health", "learning", "productivity", "mindfulness", "lifestyle"]

export const FREQUENCIES = ["daily", "weekdays", "weekends"]

export const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
export const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))
export const PERIODS = ["AM", "PM"]

export const PRIORITIES=["low", "medium", "high"]

// decides the colors corresponding to the category of the habits
export const categoryColors = {
    health: "bg-green-500/20 text-green-400",
    learning: "bg-blue-500/20 text-blue-400",
    productivity: "bg-purple-500/20 text-purple-400",
    mindfulness: "bg-yellow-500/20 text-yellow-400",
    lifestyle: "bg-pink-500/20 text-pink-400",
}

export const categoryColorsText = {
    health: "text-green-400",
    learning: "text-blue-400",
    productivity: "text-purple-400",
    mindfulness: "text-yellow-400",
    lifestyle: "text-pink-400",
}

