const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const TIME_LABELS = {
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
};

export async function detectPatterns(supabase, userId) {
    if (!supabase) {
        throw new Error("Supabase client is required");
    }

    if (!userId) {
        throw new Error("User ID is required");
    }

    const today = new Date();

    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const sixtyDaysAgoString = formatDate(sixtyDaysAgo);
    const todayString = formatDate(today);

    const { data: habits, error: habitsError } = await supabase
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
        .eq("user_id", userId);

    if (habitsError) {
        console.error("Error fetching habits:", habitsError);
        throw habitsError;
    }

    if (!habits || habits.length === 0) {
        return [];
    }

    const habitIds = habits.map((habit) => habit.id);

    const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select(`
            habit_id,
            completed_on
        `)
        .in("habit_id", habitIds)
        .gte("completed_on", sixtyDaysAgoString)
        .lte("completed_on", todayString);

    if (completionsError) {
        console.error(
            "Error fetching habit completions:",
            completionsError
        );

        throw completionsError;
    }

    const safeCompletions = completions || [];

    const patterns = [];

    for (const habit of habits) {
        const habitCompletions = safeCompletions.filter(
            (completion) => completion.habit_id === habit.id
        );

        const habitPatterns = analyzeHabit(
            habit,
            habitCompletions,
            today
        );

        patterns.push(...habitPatterns);
    }

    const relationshipPatterns = detectHabitRelationships(
        habits,
        safeCompletions
    );

    patterns.push(...relationshipPatterns);

    return removeDuplicatePatterns(patterns)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
}

function analyzeHabit(habit, completions, today) {
    const patterns = [];

    const streakPattern = detectStreakPattern(habit);

    if (streakPattern) {
        patterns.push(streakPattern);
    }

    const trendPattern = detectTrend(
        habit,
        completions,
        today
    );

    if (trendPattern) {
        patterns.push(trendPattern);
    }

    const dayPattern = detectDayOfWeekPattern(
        habit,
        completions,
        today
    );

    if (dayPattern) {
        patterns.push(dayPattern);
    }

    const recurringFailurePattern =
        detectRecurringFailure(
            habit,
            completions,
            today
        );

    if (recurringFailurePattern) {
        patterns.push(recurringFailurePattern);
    }

    const timePattern = detectPreferredTimePattern(
        habit,
        completions,
        today
    );

    if (timePattern) {
        patterns.push(timePattern);
    }

    return patterns;
}

function detectStreakPattern(habit) {
    const currentStreak = Number(
        habit.current_streak || 0
    );

    const longestStreak = Number(
        habit.longest_streak || 0
    );

    if (currentStreak < 4) {
        return null;
    }

    let confidence = "medium";

    if (currentStreak >= 7) {
        confidence = "high";
    }

    return {
        type: "streak_strength",

        habitId: habit.id,

        habitTitle: habit.title,

        evidence: {
            currentStreak,
            longestStreak,
        },

        recommendation:
            "Protect the routine that is already working by keeping the habit easy to complete on busy days.",

        confidence,

        score: Math.min(
            10,
            3 + currentStreak * 0.4
        ),
    };
}

function detectTrend(habit, completions, today) {
    const currentPeriodStart = new Date(today);

    currentPeriodStart.setDate(
        currentPeriodStart.getDate() - 29
    );

    const previousPeriodStart = new Date(today);

    previousPeriodStart.setDate(
        previousPeriodStart.getDate() - 59
    );

    const previousPeriodEnd = new Date(today);

    previousPeriodEnd.setDate(
        previousPeriodEnd.getDate() - 30
    );

    const currentStats = getPeriodStats(
        habit,
        completions,
        currentPeriodStart,
        today
    );

    const previousStats = getPeriodStats(
        habit,
        completions,
        previousPeriodStart,
        previousPeriodEnd
    );

    if (
        currentStats.scheduled < 3 ||
        previousStats.scheduled < 3
    ) {
        return null;
    }

    const difference =
        currentStats.completionRate -
        previousStats.completionRate;

    if (Math.abs(difference) < 15) {
        return null;
    }

    if (difference > 0) {
        return {
            type: "improving_trend",

            habitId: habit.id,

            habitTitle: habit.title,

            evidence: {
                previousCompletionRate:
                    previousStats.completionRate,

                currentCompletionRate:
                    currentStats.completionRate,

                improvementPoints:
                    difference,
            },

            recommendation:
                "Identify what changed recently and keep that part of your routine consistent.",

            confidence:
                currentStats.scheduled >= 8
                    ? "high"
                    : "medium",

            score: Math.min(
                9,
                4 + difference / 10
            ),
        };
    }

    return {
        type: "declining_trend",

        habitId: habit.id,

        habitTitle: habit.title,

        evidence: {
            previousCompletionRate:
                previousStats.completionRate,

            currentCompletionRate:
                currentStats.completionRate,

            declinePoints:
                Math.abs(difference),
        },

        recommendation:
            "Reduce the habit to a smaller version temporarily so it is easier to rebuild consistency.",

        confidence:
            currentStats.scheduled >= 8
                ? "high"
                : "medium",

        score: Math.min(
            10,
            5 + Math.abs(difference) / 10
        ),
    };
}

function detectDayOfWeekPattern(
    habit,
    completions,
    today
) {
    const startDate = new Date(today);

    startDate.setDate(
        startDate.getDate() - 55
    );

    const dayStats = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const scheduledDates =
            getScheduledDatesForDay(
                habit,
                startDate,
                today,
                dayIndex
            );

        if (scheduledDates.length < 3) {
            continue;
        }

        const completedCount =
            countCompletedDates(
                completions,
                scheduledDates
            );

        const completionRate = calculateRate(
            completedCount,
            scheduledDates.length
        );

        dayStats.push({
            dayIndex,
            dayName: DAY_NAMES[dayIndex],
            scheduled: scheduledDates.length,
            completed: completedCount,
            completionRate,
        });
    }

    if (dayStats.length < 2) {
        return null;
    }

    dayStats.sort(
        (a, b) =>
            b.completionRate -
            a.completionRate
    );

    const strongestDay = dayStats[0];

    const weakestDay =
        dayStats[dayStats.length - 1];

    const difference =
        strongestDay.completionRate -
        weakestDay.completionRate;

    if (difference < 30) {
        return null;
    }

    return {
        type: "day_of_week_pattern",

        habitId: habit.id,

        habitTitle: habit.title,

        evidence: {
            strongestDay:
                strongestDay.dayName,

            strongestRate:
                strongestDay.completionRate,

            weakestDay:
                weakestDay.dayName,

            weakestRate:
                weakestDay.completionRate,

            differencePoints:
                difference,
        },

        recommendation:
            `Plan a smaller or easier version of ${habit.title} for ${weakestDay.dayName}.`,

        confidence:
            weakestDay.scheduled >= 5
                ? "high"
                : "medium",

        score: Math.min(
            10,
            5 + difference / 20
        ),
    };
}

function detectRecurringFailure(
    habit,
    completions,
    today
) {
    const startDate = new Date(today);

    startDate.setDate(
        startDate.getDate() - 55
    );

    let worstDay = null;

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        if (!isHabitScheduledForDay(habit, dayIndex)) {
            continue;
        }

        const scheduledDates =
            getScheduledDatesForDay(
                habit,
                startDate,
                today,
                dayIndex
            );

        if (scheduledDates.length < 4) {
            continue;
        }

        const completed =
            countCompletedDates(
                completions,
                scheduledDates
            );

        const missed =
            scheduledDates.length -
            completed;

        const completionRate =
            calculateRate(
                completed,
                scheduledDates.length
            );

        if (
            completionRate <= 50 &&
            missed >= 3
        ) {
            if (
                !worstDay ||
                completionRate <
                worstDay.completionRate
            ) {
                worstDay = {
                    dayIndex,
                    dayName:
                        DAY_NAMES[dayIndex],

                    scheduled:
                        scheduledDates.length,

                    completed,

                    missed,

                    completionRate,
                };
            }
        }
    }

    if (!worstDay) {
        return null;
    }

    return {
        type: "recurring_failure",

        habitId: habit.id,

        habitTitle: habit.title,

        evidence: {
            failureDay:
                worstDay.dayName,

            completed:
                worstDay.completed,

            scheduled:
                worstDay.scheduled,

            missed:
                worstDay.missed,

            completionRate:
                worstDay.completionRate,
        },

        recommendation:
            `Make ${habit.title} easier or schedule it differently on ${worstDay.dayName}.`,

        confidence:
            worstDay.scheduled >= 6
                ? "high"
                : "medium",

        score: Math.min(
            10,
            7 +
            (100 -
                worstDay.completionRate) /
            30
        ),
    };
}

function detectPreferredTimePattern(
    habit,
    completions,
    today
) {
    if (!habit.preferred_time) {
        return null;
    }

    const preferredTime = String(
        habit.preferred_time
    ).toLowerCase();

    if (!TIME_LABELS[preferredTime]) {
        return null;
    }

    const startDate = new Date(today);

    startDate.setDate(
        startDate.getDate() - 29
    );

    const stats = getPeriodStats(
        habit,
        completions,
        startDate,
        today
    );

    if (stats.scheduled < 5) {
        return null;
    }

    if (stats.completionRate >= 75) {
        return {
            type: "time_of_day_pattern",

            habitId: habit.id,

            habitTitle: habit.title,

            evidence: {
                preferredTime,
                completionRate:
                    stats.completionRate,
                scheduled:
                    stats.scheduled,
                completed:
                    stats.completed,
            },

            recommendation:
                `Keep ${habit.title} anchored to your ${preferredTime} routine because that schedule is currently working well.`,

            confidence:
                stats.scheduled >= 8
                    ? "high"
                    : "medium",

            score:
                5 +
                stats.completionRate / 25,
        };
    }

    if (stats.completionRate <= 40) {
        return {
            type: "time_of_day_pattern",

            habitId: habit.id,

            habitTitle: habit.title,

            evidence: {
                preferredTime,
                completionRate:
                    stats.completionRate,
                scheduled:
                    stats.scheduled,
                completed:
                    stats.completed,
            },

            recommendation:
                `Experiment with moving ${habit.title} away from ${preferredTime}, since that slot has been difficult to maintain.`,

            confidence:
                stats.scheduled >= 8
                    ? "high"
                    : "medium",

            score:
                6 +
                (100 -
                    stats.completionRate) /
                25,
        };
    }

    return null;
}

function detectHabitRelationships(
    habits,
    completions
) {
    const patterns = [];

    if (habits.length < 2) {
        return patterns;
    }

    const completionMap = {};

    for (const habit of habits) {
        completionMap[habit.id] = new Set();
    }

    for (const completion of completions) {
        if (
            completionMap[completion.habit_id]
        ) {
            completionMap[
                completion.habit_id
            ].add(
                normalizeDate(
                    completion.completed_on
                )
            );
        }
    }

    for (let i = 0; i < habits.length; i++) {
        for (
            let j = 0;
            j < habits.length;
            j++
        ) {
            if (i === j) {
                continue;
            }

            const targetHabit = habits[i];
            const relatedHabit = habits[j];

            const targetDates =
                completionMap[targetHabit.id];

            const relatedDates =
                completionMap[relatedHabit.id];

            if (
                !targetDates ||
                !relatedDates ||
                relatedDates.size < 4
            ) {
                continue;
            }

            let togetherCount = 0;

            for (const date of relatedDates) {
                if (targetDates.has(date)) {
                    togetherCount++;
                }
            }

            const relationshipRate =
                calculateRate(
                    togetherCount,
                    relatedDates.size
                );

            if (
                relationshipRate < 70 ||
                togetherCount < 3
            ) {
                continue;
            }

            patterns.push({
                type:
                    "positive_habit_relationship",

                habitId:
                    targetHabit.id,

                habitTitle:
                    targetHabit.title,

                relatedHabitId:
                    relatedHabit.id,

                relatedHabitTitle:
                    relatedHabit.title,

                evidence: {
                    targetHabit:
                        targetHabit.title,

                    relatedHabit:
                        relatedHabit.title,

                    completedTogether:
                        togetherCount,

                    relatedHabitCompletions:
                        relatedDates.size,

                    relationshipRate,
                },

                recommendation:
                    `Try pairing ${targetHabit.title} with ${relatedHabit.title} when possible.`,

                confidence:
                    togetherCount >= 6
                        ? "high"
                        : "medium",

                score:
                    5 +
                    relationshipRate / 25,
            });
        }
    }

    return patterns;
}

function getPeriodStats(
    habit,
    completions,
    startDate,
    endDate
) {
    const scheduledDates =
        getScheduledDates(
            habit,
            startDate,
            endDate
        );

    const completed =
        countCompletedDates(
            completions,
            scheduledDates
        );

    return {
        scheduled:
            scheduledDates.length,

        completed,

        missed:
            Math.max(
                0,
                scheduledDates.length -
                completed
            ),

        completionRate:
            calculateRate(
                completed,
                scheduledDates.length
            ),
    };
}

function getScheduledDates(
    habit,
    startDate,
    endDate
) {
    const dates = [];

    const current = new Date(startDate);

    current.setHours(12, 0, 0, 0);

    const end = new Date(endDate);

    end.setHours(12, 0, 0, 0);

    while (current <= end) {
        const dayIndex =
            current.getDay();

        if (
            isHabitScheduledForDay(
                habit,
                dayIndex
            )
        ) {
            dates.push(formatDate(current));
        }

        current.setDate(
            current.getDate() + 1
        );
    }

    return dates;
}

function getScheduledDatesForDay(
    habit,
    startDate,
    endDate,
    dayIndex
) {
    if (
        !isHabitScheduledForDay(
            habit,
            dayIndex
        )
    ) {
        return [];
    }

    const dates = [];

    const current =
        new Date(startDate);

    current.setHours(12, 0, 0, 0);

    const end =
        new Date(endDate);

    end.setHours(12, 0, 0, 0);

    while (current <= end) {
        if (
            current.getDay() ===
            dayIndex
        ) {
            dates.push(
                formatDate(current)
            );
        }

        current.setDate(
            current.getDate() + 1
        );
    }

    return dates;
}

function isHabitScheduledForDay(
    habit,
    dayIndex
) {
    if (
        !habit.target_days ||
        !Array.isArray(habit.target_days)
    ) {
        return true;
    }

    if (habit.target_days.length === 0) {
        return true;
    }

    return habit.target_days.includes(
        dayIndex
    );
}

function countCompletedDates(
    completions,
    scheduledDates
) {
    const scheduledSet =
        new Set(scheduledDates);

    const completedSet =
        new Set();

    for (const completion of completions) {
        const date =
            normalizeDate(
                completion.completed_on
            );

        if (scheduledSet.has(date)) {
            completedSet.add(date);
        }
    }

    return completedSet.size;
}

function calculateRate(
    completed,
    scheduled
) {
    if (!scheduled) {
        return 0;
    }

    return Math.round(
        (completed / scheduled) * 100
    );
}

function normalizeDate(value) {
    if (!value) {
        return "";
    }

    if (
        typeof value === "string" &&
        value.length >= 10
    ) {
        return value.slice(0, 10);
    }

    return formatDate(
        new Date(value)
    );
}

function formatDate(date) {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function removeDuplicatePatterns(
    patterns
) {
    const seen = new Set();

    const uniquePatterns = [];

    for (const pattern of patterns) {
        const key = [
            pattern.type,
            pattern.habitId || "",
            pattern.relatedHabitId || "",
        ].join("-");

        if (!seen.has(key)) {
            seen.add(key);
            uniquePatterns.push(pattern);
        }
    }

    return uniquePatterns;
}