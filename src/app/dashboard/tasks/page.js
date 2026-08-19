'use client'
import { useState, useEffect, useCallback } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import TaskModal from "@/components/common/modals/TaskModal";
import TaskCard from "./TaskCard";

const badgeStyles = {
    rose: "bg-rose-50 text-rose-500",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-500",
};
function SectionHeader({ label, count }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold tracking-[0.12em] text-gray-400">
                {label}
            </h2>
            {count != null && (
                <span className="text-[11px] font-semibold text-gray-400">
                    {count} {count === 1 ? "Task" : "Tasks"}
                </span>
            )}
        </div>
    );
}


export default function TasksPage() {
    const PAGE_SIZE = 10
    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false)
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)      
    const [loadingMore, setLoadingMore] = useState(false) // "See More" click specifically — separate state so
    // the whole list doesn't show a loading skeleton again

    const fetchPage = useCallback(async (currentOffset, isInitial) => {
        isInitial ? setLoading(true) : setLoadingMore(true)
        try {
            const res = await fetch(`/api/tasks/bulk?limit=${PAGE_SIZE}&offset=${currentOffset}`)
            const result = await res.json()
            if (!res.ok) throw new Error(result.error)

            setTasks(prev => isInitial ? result.data : [...prev, ...result.data]) // <- the actual "See More" behavior:
            //    append instead of replace
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
    // function toggleTask(id) {
    //     setTasks((prev) =>
    //         prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    //     );
    // }

    // function deleteTask(id) {
    //     setTasks((prev) => prev.filter((t) => t.id !== id));
    // }

    // const today = tasks.filter((t) => t.section === "today");
    // const upcoming = tasks.filter((t) => t.section === "upcoming");

    useEffect(() => {
        function handleAddTask() { setShowAddModal(true) }
        window.addEventListener('open-add-task', handleAddTask)
        return () => window.removeEventListener('open-add-task', handleAddTask)
    }, [])


    // const fetchTasks= async ()=>{
    //   try {
    //       const res= await fetch('/api/tasks/bulk')
    //       const data=await res.json()
    //       setTasks(data)
    //   } catch (error) {
    //     console.log("Error while fetching tasks from backend", error)
    //   }
    // }

    // useEffect(()=>{
    //     fetchTasks()
    // },[])

    return (
        <div className="w-full min-h-screen flex justify-center px-3 py-2">
            <div className="w-full p-4">
                <section className="mb-6">
                    <SectionHeader label="TODAY" 
                    // count={today.length} 
                    />
                    <div className="flex flex-col gap-2.5">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                // onToggle={toggleTask}
                                // onDelete={deleteTask}
                            />
                        ))}
                    </div>
                    {hasMore && (
                        <button
                            onClick={seeMore}
                            disabled={loadingMore}
                            className="mt-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                        >
                            {loadingMore ? "Loading..." : "See More"}
                        </button>
                    )}
                </section>

                {
                    showAddModal &&
                    <TaskModal
                        mode="add"
                        onClose={() => setShowAddModal(false)} />
                }

                {/* {upcoming.length > 0 && (
                    <section>
                        <SectionHeader label="UPCOMING" />
                        <div className="flex flex-col gap-2.5">
                            {upcoming.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={deleteTask}
                                />
                            ))}
                        </div>
                    </section>
                )} */}
            </div>
        </div>
    );

}