'use client'
import { useState, useEffect } from "react";
import TaskModal from "@/components/common/modals/TaskModal";
import TaskCard from "./TaskCard";
import { useAllTasks } from "@/hooks/useAllTasks";
import ButtonWithIcon from "@/components/common/buttons/ButtonWithIcon";

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
    const { tasks, toggleTask, deleteTask, hasMore, loading, loadingMore, seeMore } = useAllTasks()
    
    const [showAddModal, setShowAddModal] = useState(false)

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
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        ))}
                    </div>
                    {hasMore && (
                        <div className="flex justify-center items-center py-6">
                        <ButtonWithIcon
                            onClick={seeMore}
                            disabled={loadingMore}
                            // className="mt-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                            text={loadingMore ? "Loading..." : "See More"}

                        />
                        </div>
                    )}
                </section>

                {
                    showAddModal &&
                    <TaskModal
                        mode="add"
                        onClose={() => setShowAddModal(false)} />
                }
            </div>
        </div>
    );
}