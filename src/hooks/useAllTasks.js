import { useState, useEffect, useCallback } from "react"

const PAGE_SIZE = 10

export function useAllTasks() {
    const [tasks, setTasks] = useState([])
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const fetchPage = useCallback(async (currentOffset, isInitial) => {
        isInitial ? setLoading(true) : setLoadingMore(true)
        try {
            const res = await fetch(`/api/tasks/bulk?limit=${PAGE_SIZE}&offset=${currentOffset}`)
            const result = await res.json()
            if (!res.ok) throw new Error(result.error)

            setTasks(prev => isInitial ? result.data : [...prev, ...result.data])
            setHasMore(result.hasMore)
            setOffset(currentOffset + result.data.length)
        } finally {
            isInitial ? setLoading(false) : setLoadingMore(false)
        }
    }, [])

    useEffect(() => {
        fetchPage(0, true)
    }, [fetchPage])

    function seeMore() {
        if (!hasMore || loadingMore) return
        fetchPage(offset, false)
    }

    async function toggleTask(taskId, isCurrentlyCompleted) {
        const newStatus = isCurrentlyCompleted ? "todo" : "completed"

        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ))

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (!res.ok) throw new Error('Failed')
        } catch (error) {
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status: isCurrentlyCompleted ? "completed" : "todo" } : t
            ))
        }
    }

    async function deleteTask(taskId) {
        const previous = tasks
        setTasks(prev => prev.filter(t => t.id !== taskId))

        try {
            const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed')
        } catch (error) {
            // revert to the exact pre-delete list, including whatever pages were loaded
            setTasks(previous) 
        }
    }

    const tasksWithStatus = tasks.map(t => ({
        ...t,
        completedToday: t.status === "completed"
    }))

    return { tasks: tasksWithStatus, toggleTask, deleteTask, hasMore, loading, loadingMore, seeMore }
}