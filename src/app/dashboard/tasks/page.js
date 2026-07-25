'use client'
import { useState, useEffect } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import TaskModal from "@/components/common/modals/TaskModal";

const initialTasks = [
    {
        id: 1,
        title: "Review job applications",
        section: "today",
        done: true,
    },
    {
        id: 2,
        title: "Push onboarding changes to GitHub",
        section: "today",
        done: true,
    },
    {
        id: 3,
        title: "Fix dashboard streak bug",
        section: "today",
        done: false,
        badge: { label: "Due Today", tone: "rose" },
    },
    {
        id: 4,
        title: "Write LinkedIn post about Habitrea AI",
        section: "today",
        done: false,
        badge: { label: "Due Today", tone: "amber" },
    },
    {
        id: 5,
        title: "Research competitor pricing",
        section: "upcoming",
        done: false,
        badge: { label: "Due Tomorrow", tone: "violet" },
    },
];

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

function TaskRow({ task, onToggle, onDelete }) {
    const { title, done, badge } = task;

    return (
        <div
            className={`group flex items-center justify-between gap-3 rounded-xl border bg-white pl-3 pr-3 py-3 sm:pl-4 sm:pr-4 transition-colors
        ${done ? "border-l-4 border-l-rose-400 border-y-gray-100 border-r-gray-100" : "border-l-4 border-l-transparent border-gray-100"}
      `}
        >
            {/* Left: checkbox + title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                    onClick={() => onToggle(task.id)}
                    aria-label={done ? "Mark task incomplete" : "Mark task complete"}
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer
            ${done ? "bg-blue-500" : "border-2 border-gray-300 hover:border-blue-400"}
          `}
                >
                    {done && <Check size={12} strokeWidth={3} className="text-white" />}
                </button>

                <p
                    className={`text-sm font-medium truncate sm:whitespace-normal sm:break-words
            ${done ? "line-through text-gray-400" : "text-gray-700"}
          `}
                >
                    {title}
                </p>
            </div>

            {/* Right: badge + actions */}
            <div className="flex items-center gap-2 shrink-0">
                {badge && (
                    <span
                        className={`hidden xs:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyles[badge.tone]}`}
                    >
                        {badge.label}
                    </span>
                )}

                {!done && (
                    <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            aria-label="Edit task"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            aria-label="Delete task"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TasksPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [showAddModal, setShowAddModal] = useState(false)


    function toggleTask(id) {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
    }

    function deleteTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    const today = tasks.filter((t) => t.section === "today");
    const upcoming = tasks.filter((t) => t.section === "upcoming");

    useEffect(() => {
        function handleAddTask() { setShowAddModal(true) }
        window.addEventListener('open-add-task', handleAddTask)
        return () => window.removeEventListener('open-add-task', handleAddTask)
    }, [])

    return (
        <div className="w-full min-h-screen flex justify-center px-3 py-2">
            <div className="w-full p-4">
                <section className="mb-6">
                    <SectionHeader label="TODAY" count={today.length} />
                    <div className="flex flex-col gap-2.5">
                        {today.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        ))}
                    </div>
                </section>

                {
                    showAddModal &&
                    <TaskModal
                        mode="add"
                        onClose={() => setShowAddModal(false)} />
                }

                {upcoming.length > 0 && (
                    <section>
                        <SectionHeader label="UPCOMING" />
                        <div className="flex flex-col gap-2.5">
                            {upcoming.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={deleteTask}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

}