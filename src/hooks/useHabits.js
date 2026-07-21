// src/hooks/useHabits.js
async function toggleHabit(habitId, isCurrentlyCompleted) {
    // 1. Update UI instantly — don't wait for API
    setCompletedIds(prev => {
        const next = new Set(prev)
        isCurrentlyCompleted ? next.delete(habitId) : next.add(habitId)
        return next
    })

    // Update streak optimistically
    setHabits(prev => prev.map(h =>
        h.id === habitId
            ? {
                ...h, current_streak: isCurrentlyCompleted
                    ? h.current_streak - 1
                    : h.current_streak + 1
            }
            : h
    ))

    try {
        // 2. Sync to server
        const res = await fetch('/api/habits/complete', {
            method: isCurrentlyCompleted ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ habitId })
        })
        if (!res.ok) throw new Error('Failed')

    } catch {
        // 3. Revert on failure
        setCompletedIds(prev => {
            const next = new Set(prev)
            isCurrentlyCompleted ? next.add(habitId) : next.delete(habitId)
            return next
        })
        setHabits(prev => prev.map(h =>
            h.id === habitId
                ? {
                    ...h, current_streak: isCurrentlyCompleted
                        ? h.current_streak + 1
                        : h.current_streak - 1
                }
                : h
        ))
        // Show toast: "Couldn't save. Try again."
    }
}