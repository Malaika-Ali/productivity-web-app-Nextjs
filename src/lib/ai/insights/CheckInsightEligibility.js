const MIN_TRACKING_DAYS = 7
const MIN_ACTIVE_DAYS = 4

export function checkInsightEligibility({
    firstActivityAt,
    activeDays,
    now = new Date(),
}) {
    if (!firstActivityAt) {
        return {
            eligible: false,
            reason: "no_activity",
        }
    }

    const firstActivity = new Date(firstActivityAt)

    if (Number.isNaN(firstActivity.getTime())) {
        return {
            eligible: false,
            reason: "invalid_activity_date",
        }
    }

    const elapsedMs = now.getTime() - firstActivity.getTime()
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24)

    if (elapsedDays < MIN_TRACKING_DAYS) {
        return {
            eligible: false,
            reason: "insufficient_history",
        }
    }

    if (activeDays < MIN_ACTIVE_DAYS) {
        return {
            eligible: false,
            reason: "insufficient_activity",
        }
    }

    return {
        eligible: true,
        reason: null,
    }
}
