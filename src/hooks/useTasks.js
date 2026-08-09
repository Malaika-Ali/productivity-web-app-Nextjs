import { useState, useEffect } from "react";

export function useTasks(){
    const [tasks, setTasks] = useState([])
    // const [completedIds, setCompletedIds] = useState(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function fetchTasks(){
            const res=await fetch('/api/tasks/today')
            const data=await res.json()

            setTasks(data.data || [])
            setLoading(false)
        }
        fetchTasks()
    }, [])

    async function toggleTask(taskId, isCurrentlyCompleted){
       const newStatus= isCurrentlyCompleted? "todo": "completed"

    //    optimistic updateTag, flip the status of the task in the local state
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ))

        // syncing with the database
      try {
          const res = await fetch(`/api/tasks/${taskId}`,{
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
          }) 
          if (!res.ok) throw new Error('Failed')
      } catch (error) {
    // rvert on failure
          setTasks(prev => prev.map(t =>
              t.id === taskId ? { ...t, status: isCurrentlyCompleted ? "completed" : "todo" } : t
          ))
      }
    }

    const tasksWithStatus = tasks.map(t => ({
        ...t,
        completedToday: t.status === "completed"
    }))

    return { tasks: tasksWithStatus, toggleTask, loading }

}