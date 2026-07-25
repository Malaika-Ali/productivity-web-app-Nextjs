import { useState, useEffect, useCallback } from "react"

export function useInsights() {
    const [insight, setInsight] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    const fetchInsight = useCallback(async () => {
        try {
            setError(null)
            const res = await fetch("/api/ai/weeklyInsight")
            if (!res.ok) throw new Error("Failed to load insights")
            const data = await res.json()
            setInsight(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const regenerate = useCallback(async () => {
        setRefreshing(true)
        try {
            setError(null)
            const res = await fetch("/api/insights", { method: "POST" })
            if (!res.ok) throw new Error("Failed to regenerate insights")
            const data = await res.json()
            setInsight(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchInsight()
    }, [fetchInsight])

    return { insight, loading, refreshing, error, regenerate }
}