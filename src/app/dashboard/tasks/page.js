'use client'

import { useState, useEffect } from "react"
import TaskModal from "@/components/common/modals/TaskModal"
import TaskCard from "./TaskCard"
import { useAllTasks } from "@/hooks/useAllTasks"
import ButtonWithIcon from "@/components/common/buttons/ButtonWithIcon"
import EmptyTasksState from "@/components/emptyStates/EmptyStateUI"
import Loading from "../Loading"


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
    )
}


function TaskSection({ label, category }) {
    const {
        tasks,
        toggleTask,
        deleteTask,
        hasMore,
        loading,
        loadingMore,
        seeMore,
        total
    } = useAllTasks(category)


    // Category is still loading.
    // The main page already has a global loader,
    // so don't show another loader here.
    if (loading) {
        return null
    }


    // Category has no tasks.
    // Don't render the section at all.
    if (tasks.length === 0) {
        return null
    }


    return (
        <section className="mb-6">

            <SectionHeader
                label={label}
                count={total}
            />

            <div className="flex flex-col gap-2.5">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={() => deleteTask(task.id)}
                    />
                ))}
            </div>


            {hasMore && (
                <div className="flex justify-center items-center py-4">
                    <ButtonWithIcon
                        onClick={seeMore}
                        disabled={loadingMore}
                        text={loadingMore ? "Loading..." : "See More"}
                    />
                </div>
            )}

        </section>
    )
}


export default function TasksPage() {

    const [showAddModal, setShowAddModal] = useState(false)


    // This request is ONLY used to determine:
    // 1. Is the whole page loading?
    // 2. Does the user have ANY tasks?
    const {
        tasks,
        loading
    } = useAllTasks("all")


    useEffect(() => {

        function handleAddTask() {
            setShowAddModal(true)
        }

        window.addEventListener(
            'open-add-task',
            handleAddTask
        )

        return () => {
            window.removeEventListener(
                'open-add-task',
                handleAddTask
            )
        }

    }, [])


    return (
        <div className="w-full min-h-screen flex justify-center px-3 py-2">

            <div className="w-full p-4">
                {loading ? (

                    <Loading />

                ) : tasks.length === 0 ? (
                    <EmptyTasksState
                        element="task"
                        targetSelector="#add-task-trigger"
                    />

                ) : (
                    <>

                        <TaskSection
                            label="OVERDUE"
                            category="overdue"
                        />

                        <TaskSection
                            label="UPCOMING"
                            category="pending"
                        />

                        <TaskSection
                            label="COMPLETED"
                            category="completed"
                        />

                    </>

                )}


                {/* Add Task Modal */}
                {showAddModal && (
                    <TaskModal
                        mode="add"
                        onClose={() => setShowAddModal(false)}
                    />
                )}

            </div>

        </div>
    )
}

