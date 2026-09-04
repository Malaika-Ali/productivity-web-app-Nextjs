const TYPE_PRIORITY = {
    recurring_failure: 10,
    declining_trend: 9,
    time_of_day_pattern: 8,
    day_of_week_pattern: 8,
    positive_habit_relationship: 7,
    improving_trend: 6,
    streak_strength: 3,
}

const CONFIDENCE_SCORE = {
    high: 1,
    medium: 0.6,
    low: 0.2,
}

export function selectInsights(
    patterns,
    previousInsight = null
) {
    if (!patterns || patterns.length === 0) {
        return []
    }

    const previousPatternType =
        previousInsight?.pattern_type || null

    const previousHabitId =
        previousInsight?.habit_id || null

    const ranked = patterns
        .map((pattern) => {
            let score = pattern.score || 0

            score +=
                (TYPE_PRIORITY[pattern.type] || 0) * 0.2

            score +=
                (CONFIDENCE_SCORE[pattern.confidence] || 0) *
                0.5

            // Avoid repeatedly showing the exact same
            // type of insight for the same habit.
            if (
                previousPatternType === pattern.type &&
                previousHabitId === pattern.habitId
            ) {
                score -= 2
            }

            return {
                ...pattern,
                finalScore: score,
            }
        })
        .sort(
            (a, b) =>
                b.finalScore - a.finalScore
        )

    // Give Gemini only the strongest candidates.
    return ranked.slice(0, 5)
}