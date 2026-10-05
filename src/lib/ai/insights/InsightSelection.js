const TYPE_PRIORITY = {
    positive_habit_relationship: 10,
    negative_habit_relationship: 10,
    task_load_relationship: 10,
    declining_trend: 9,
    recovery: 8,
    day_of_week_pattern: 8,
    scheduled_time_performance: 7,
    improving_trend: 7,
    streak_strength: 4,
}

export function selectInsights(patterns, previousInsight = null) {
    if (!Array.isArray(patterns) || patterns.length === 0) {
        return []
    }

    const previousType = previousInsight?.pattern_type || null
    const previousHabitId = previousInsight?.habit_id || null

    return patterns
        .map((pattern) => {
            let score = Number(pattern.score || 0)

            score += (TYPE_PRIORITY[pattern.type] || 0) * 0.25
            score += Number(pattern.confidence || 0) * 1.5
            score += Number(pattern.actionability || 0) * 1.5
            score += Number(pattern.novelty || 0)

            if (
                pattern.type === previousType &&
                pattern.habitId === previousHabitId
            ) {
                score -= 2.5
            }

            return {
                ...pattern,
                finalScore: Number(score.toFixed(2)),
            }
        })
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 5)
}
