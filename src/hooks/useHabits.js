import { useState, useEffect } from 'react'

export function useHabits() {
    const [habits, setHabits] = useState([])
    const [completedIds, setCompletedIds] = useState(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHabits() {
            const res = await fetch('/api/habits/today')
            const data = await res.json()

            setHabits(data.completedToday) // or whatever your GET route returns

            // Build the initial completedIds Set from the fetched data
            const initialCompleted = new Set(
                data.completedToday
                    .filter(h => h.completedToday)
                    .map(h => h.id)
            )
            setCompletedIds(initialCompleted)
            setLoading(false)
        }
        fetchHabits()
    }, [])

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

    // 👇 THIS is the actual change — merge completedIds into habits before returning
    const habitsWithStatus = habits.map(h => ({
        ...h,
        completedToday: completedIds.has(h.id)
    }))

    return { habits: habitsWithStatus, toggleHabit, loading }
}