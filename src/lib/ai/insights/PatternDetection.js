const MIN_OBSERVATIONS = 5
const MIN_RELATIONSHIP_OBSERVATIONS = 8

export function detectPatterns(profile) {
    const patterns = []

    for (const habit of profile.habits) {
        const trend = detectTrend(habit)
        if (trend) patterns.push(trend)

        const dayPattern = detectDayPattern(habit)
        if (dayPattern) patterns.push(dayPattern)

        const scheduledTimePattern = detectScheduledTimePerformance(habit)
        if (scheduledTimePattern) patterns.push(scheduledTimePattern)

        const recovery = detectRecovery(habit)
        if (recovery) patterns.push(recovery)

        const streak = detectMeaningfulStreak(habit)
        if (streak) patterns.push(streak)
    }

    const relationships = detectHabitRelationships(profile)
    patterns.push(...relationships)

    const overload = detectTaskLoadRelationships(profile)
    patterns.push(...overload)

    return dedupePatterns(patterns)
        .filter((pattern) => pattern.confidence >= 0.65)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
}

function detectTrend(habit) {
    if (habit.rows.length < 10) return null
    if (habit.recentRate == null || habit.previousRate == null) return null

    const difference = habit.recentRate - habit.previousRate

    if (Math.abs(difference) < 15) return null

    const improving = difference > 0

    return {
        type: improving ? "improving_trend" : "declining_trend",
        habitId: habit.id,
        habitTitle: habit.title,
        evidence: {
            recentCompletionRate: habit.recentRate,
            previousCompletionRate: habit.previousRate,
            changePoints: Math.abs(difference),
            observations: habit.rows.length,
        },
        confidence: confidenceFromObservations(habit.rows.length),
        evidenceStrength: Math.min(1, Math.abs(difference) / 40),
        actionability: improving ? 0.65 : 0.9,
        novelty: 0.65,
        goalRelevance: 0.75,
        score: 5 + Math.min(4, Math.abs(difference) / 10),
    }
}

function detectDayPattern(habit) {
    const groups = Array.from({ length: 7 }, (_, dayIndex) => {
        const rows = habit.rows.filter((row) => row.dayIndex === dayIndex)
        if (!rows.length) return null

        const completed = rows.filter((row) => row.completed).length

        return {
            dayIndex,
            dayName: rows[0].dayName,
            observations: rows.length,
            rate: Math.round((completed / rows.length) * 100),
        }
    }).filter(Boolean)

    if (groups.length < 2) return null

    const strongest = [...groups].sort((a, b) => b.rate - a.rate)[0]
    const weakest = [...groups].sort((a, b) => a.rate - b.rate)[0]

    if (
        strongest.observations < 3 ||
        weakest.observations < 3 ||
        strongest.rate - weakest.rate < 30
    ) {
        return null
    }

    const totalObservations =
        strongest.observations + weakest.observations

    return {
        type: "day_of_week_pattern",
        habitId: habit.id,
        habitTitle: habit.title,
        evidence: {
            strongestDay: strongest.dayName,
            strongestRate: strongest.rate,
            weakestDay: weakest.dayName,
            weakestRate: weakest.rate,
            differencePoints: strongest.rate - weakest.rate,
            observations: totalObservations,
        },
        confidence: confidenceFromObservations(totalObservations),
        evidenceStrength: Math.min(
            1,
            (strongest.rate - weakest.rate) / 60
        ),
        actionability: 0.85,
        novelty: 0.8,
        goalRelevance: 0.7,
        score: 6 + Math.min(3, (strongest.rate - weakest.rate) / 20),
    }
}

function detectScheduledTimePerformance(habit) {
    if (!habit.preferredTime || habit.rows.length < 8) return null

    // We do NOT have actual completion timestamps in Habitrea's current
    // habit_completions table, so this detector only evaluates whether the
    // user's chosen schedule is succeeding. It deliberately does not claim
    // that a particular clock time causes success.
    const rate = habit.completionRate

    if (rate == null || (rate > 40 && rate < 75)) return null

    return {
        type: "scheduled_time_performance",
        habitId: habit.id,
        habitTitle: habit.title,
        evidence: {
            preferredTime: habit.preferredTime,
            completionRate: rate,
            observations: habit.rows.length,
        },
        confidence: confidenceFromObservations(habit.rows.length),
        evidenceStrength: Math.min(1, Math.abs(rate - 50) / 50),
        actionability: rate <= 40 ? 0.82 : 0.55,
        novelty: 0.55,
        goalRelevance: 0.7,
        score: rate <= 40 ? 7 : 5,
    }
}

function detectRecovery(habit) {
    const rows = habit.rows
    if (rows.length < 14) return null

    const recent = rows.slice(-7)
    const previous = rows.slice(-14, -7)

    if (recent.length < 5 || previous.length < 5) return null

    const recentRate = percentCompleted(recent)
    const previousRate = percentCompleted(previous)

    if (previousRate > 50 || recentRate < 65) return null

    return {
        type: "recovery",
        habitId: habit.id,
        habitTitle: habit.title,
        evidence: {
            previousWeekRate: previousRate,
            recentWeekRate: recentRate,
            improvementPoints: recentRate - previousRate,
            observations: recent.length + previous.length,
        },
        confidence: confidenceFromObservations(
            recent.length + previous.length
        ),
        evidenceStrength: Math.min(
            1,
            (recentRate - previousRate) / 50
        ),
        actionability: 0.75,
        novelty: 0.85,
        goalRelevance: 0.75,
        score: 7 + Math.min(2, (recentRate - previousRate) / 20),
    }
}

function detectMeaningfulStreak(habit) {
    if (habit.currentStreak < 5) return null

    return {
        type: "streak_strength",
        habitId: habit.id,
        habitTitle: habit.title,
        evidence: {
            currentStreak: habit.currentStreak,
            longestStreak: habit.longestStreak,
        },
        confidence: habit.currentStreak >= 7 ? 0.85 : 0.7,
        evidenceStrength: Math.min(1, habit.currentStreak / 10),
        actionability: 0.5,
        novelty: 0.35,
        goalRelevance: 0.65,
        score: Math.min(7, 4 + habit.currentStreak / 3),
    }
}

function detectHabitRelationships(profile) {
    const patterns = []
    const habits = profile.habits

    for (const target of habits) {
        for (const trigger of habits) {
            if (target.id === trigger.id) continue

            const comparison = compareHabitConditions(
                target.rows,
                trigger.rows
            )

            if (!comparison) continue

            const {
                targetWhenTriggerDone,
                targetWhenTriggerMissed,
                difference,
                triggerDoneObservations,
                triggerMissedObservations,
            } = comparison

            if (
                triggerDoneObservations < MIN_RELATIONSHIP_OBSERVATIONS / 2 ||
                triggerMissedObservations < MIN_RELATIONSHIP_OBSERVATIONS / 2 ||
                Math.abs(difference) < 25
            ) {
                continue
            }

            const positive = difference > 0
            const magnitude = Math.abs(difference)

            patterns.push({
                type: positive
                    ? "positive_habit_relationship"
                    : "negative_habit_relationship",

                habitId: target.id,
                habitTitle: target.title,

                relatedHabitId: trigger.id,
                relatedHabitTitle: trigger.title,

                evidence: {
                    targetHabit: target.title,
                    relatedHabit: trigger.title,
                    targetCompletionWhenRelatedDone:
                        targetWhenTriggerDone,
                    targetCompletionWhenRelatedMissed:
                        targetWhenTriggerMissed,
                    differencePoints: magnitude,
                    relatedDoneObservations:
                        triggerDoneObservations,
                    relatedMissedObservations:
                        triggerMissedObservations,
                    totalObservations:
                        triggerDoneObservations +
                        triggerMissedObservations,
                },

                // This is a behavioral association, not causation.
                confidence: relationshipConfidence(
                    triggerDoneObservations,
                    triggerMissedObservations,
                    magnitude
                ),

                evidenceStrength: Math.min(1, magnitude / 60),
                actionability: 0.95,
                novelty: 0.95,
                goalRelevance: 0.85,
                score: 7 + Math.min(3, magnitude / 20),
            })
        }
    }

    return patterns
}

function compareHabitConditions(targetRows, triggerRows) {
    const targetByDate = new Map(
        targetRows.map((row) => [row.date, row])
    )

    const triggerByDate = new Map(
        triggerRows.map((row) => [row.date, row])
    )

    let targetDoneWhenTriggerDone = 0
    let triggerDoneCount = 0

    let targetDoneWhenTriggerMissed = 0
    let triggerMissedCount = 0

    for (const [date, triggerRow] of triggerByDate) {
        const targetRow = targetByDate.get(date)

        // If the target habit was not scheduled that day, it is not evidence.
        if (!targetRow?.scheduled) continue

        if (triggerRow.completed) {
            triggerDoneCount++
            if (targetRow.completed) {
                targetDoneWhenTriggerDone++
            }
        } else {
            triggerMissedCount++
            if (targetRow.completed) {
                targetDoneWhenTriggerMissed++
            }
        }
    }

    if (!triggerDoneCount || !triggerMissedCount) return null

    const rateWhenDone = Math.round(
        (targetDoneWhenTriggerDone / triggerDoneCount) * 100
    )

    const rateWhenMissed = Math.round(
        (targetDoneWhenTriggerMissed / triggerMissedCount) * 100
    )

    return {
        targetWhenTriggerDone: rateWhenDone,
        targetWhenTriggerMissed: rateWhenMissed,
        difference: rateWhenDone - rateWhenMissed,
        triggerDoneObservations: triggerDoneCount,
        triggerMissedObservations: triggerMissedCount,
    }
}

function detectTaskLoadRelationships(profile) {
    const patterns = []

    for (const habit of profile.habits) {
        const rows = habit.rows.map((row) => {
            const day = profile.daily.find((d) => d.date === row.date)
            return {
                ...row,
                taskLoad: day?.taskLoad ?? 0,
            }
        })

        const low = rows.filter((row) => row.taskLoad <= 3)
        const medium = rows.filter(
            (row) => row.taskLoad >= 4 && row.taskLoad <= 6
        )
        const high = rows.filter((row) => row.taskLoad >= 7)

        if (low.length < 3 || high.length < 3) continue

        const lowRate = percentCompleted(low)
        const highRate = percentCompleted(high)

        if (lowRate - highRate < 25) continue

        patterns.push({
            type: "task_load_relationship",
            habitId: habit.id,
            habitTitle: habit.title,
            evidence: {
                lowTaskLoad: {
                    range: "0-3 tasks",
                    completionRate: lowRate,
                    observations: low.length,
                },
                highTaskLoad: {
                    range: "7+ tasks",
                    completionRate: highRate,
                    observations: high.length,
                },
                differencePoints: lowRate - highRate,
            },
            confidence: relationshipConfidence(
                low.length,
                high.length,
                lowRate - highRate
            ),
            evidenceStrength: Math.min(
                1,
                (lowRate - highRate) / 60
            ),
            actionability: 0.95,
            novelty: 0.9,
            goalRelevance: 0.85,
            score: 7 + Math.min(3, (lowRate - highRate) / 20),
        })
    }

    return patterns
}

function relationshipConfidence(a, b, difference) {
    const observations = a + b

    let confidence =
        Math.min(0.95, 0.55 + observations / 100)

    confidence += Math.min(0.15, difference / 400)

    return Number(confidence.toFixed(2))
}

function confidenceFromObservations(observations) {
    return Number(
        Math.min(
            0.92,
            0.55 + observations / 80
        ).toFixed(2)
    )
}

function percentCompleted(rows) {
    if (!rows.length) return 0

    return Math.round(
        (rows.filter((row) => row.completed).length / rows.length) * 100
    )
}

function dedupePatterns(patterns) {
    const seen = new Set()

    return patterns.filter((pattern) => {
        const key = [
            pattern.type,
            pattern.habitId || "",
            pattern.relatedHabitId || "",
        ].join(":")

        if (seen.has(key)) return false

        seen.add(key)
        return true
    })
}
