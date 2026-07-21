"use client";
import { useEffect, useEffectEvent, useState } from "react";


const FILTERS = ["All", "Habits", "Tasks"];
const tasks = [
    {
        id: 1,
        title: "Morning run · 20 min",
        meta: ["HABIT", "STREAK 12"],
        metaColor: "text-purple-500",
        time: "7:00 AM",
        done: true,
        type: "habit",
    },
    {
        id: 2,
        title: "Inbox zero — work email",
        meta: ["TASK", "WORK"],
        metaColor: "text-purple-500",
        time: "9:15 AM",
        done: true,
        type: "task",
    },
    {
        id: 3,
        title: "Write Q2 product brief",
        meta: ["DEEP WORK", "45 MIN"],
        metaColor: "text-amber-500",
        time: null,
        timeBadge: "NOW",
        done: false,
        active: true,
        type: "task",
    },
    {
        id: 4,
        title: "Stand-up with design team",
        meta: ["TASK", "30 MIN"],
        metaColor: "text-purple-500",
        time: "11:30 AM",
        done: false,
        type: "task",
    },
    {
        id: 5,
        title: "Read · The Creative Act",
        meta: ["HABIT", "15 MIN", "STREAK 8"],
        metaColor: "text-purple-500",
        time: "4:30 PM",
        done: false,
        type: "habit",
    },
    {
        id: 6,
        title: "Strength · push day",
        meta: ["HABIT", "35 MIN", "STREAK 4"],
        metaColor: "text-amber-500",
        time: "6:00 PM",
        done: false,
        type: "habit",
    },
];

function CheckIcon({ done, active }) {
    if (done) {
        return (
            <div className="w-6 h-6 rounded-md bg-green-400 flex items-center justify-center shrink-0">
                <svg width="13" height="20" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3.5 3.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }
    return (
        <div
            className={`w-6 h-6 rounded-md border-2 shrink-0 ${active ? "border-purple-500" : "border-gray-300"
                }`}
        />
    );
}

export default function TodaysPlans() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [habitsList, setHabitsList] = useState([])
    const [completedHabits, setCompletedHabits] = useState([])

    const filtered = tasks.filter((t) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Habits") return t.type === "habit";
        if (activeFilter === "Tasks") return t.type === "task";
        return true;
    });

    const fetchHabits = async () => {
        const res = await fetch('/api/habits/today')
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }
        const { habits } = await res.json()
        setHabitsList(habits)
    }

    useEffect(() => {
        fetchHabits()
        console.log(habitsList)
    }, [])

    return (
        <div className="bg-white rounded-3xl p-6 w-full max-w-170 border-2 border-b-8 border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 tracking-tighter">Today's plan</h2>
                <div className="flex items-center gap-1  rounded-xl p-1">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-[12.4px] font-bold transition-all cursor-pointer ${activeFilter === f
                                ? "bg-purple-50 text-purple-800 shadow-sm"
                                : "text-gray-500 hover:text-gray-600"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-2.5">
                {filtered.map((task) => (
                    <div
                        key={task.id}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${task.active
                            ? "border-purple-500 bg-white shadow-[0_0_0_1px_rgba(168,85,247,0.2)] border-2"
                            : "border-gray-100 bg-gray-50/60"
                            }`}
                    >
                        {/* Left: checkbox + text */}
                        <div className="flex items-center gap-3 min-w-0">
                            <CheckIcon done={task.done} active={task.active} />
                            <div className="min-w-0">
                                <p
                                    className={`text-sm font-bold leading-snug ${task.done ? "line-through text-gray-400" : "text-gray-800"
                                        }`}
                                >
                                    {task.title}
                                </p>
                                <p className={`text-[11px] font-extrabold mt-0.5 tracking-wide ${task.metaColor}`}>
                                    {task.meta.join(" · ")}
                                </p>
                            </div>
                        </div>

                        {/* Right: time or NOW badge */}
                        <div className="ml-4 shrink-0">
                            {task.timeBadge ? (
                                <span className="bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1 rounded-lg">
                                    {task.timeBadge}
                                </span>
                            ) : (
                                <span className="text-[13px] text-gray-400 font-semibold tracking-tight">{task.time}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}