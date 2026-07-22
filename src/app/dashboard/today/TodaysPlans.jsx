"use client";
import { useEffect, useEffectEvent, useState } from "react";
import HabitCard from "./HabitCard";

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

    // const filtered = tasks.filter((t) => {
    //     if (activeFilter === "All") return true;
    //     if (activeFilter === "Habits") return t.type === "habit";
    //     if (activeFilter === "Tasks") return t.type === "task";
    //     return true;
    // });

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits/today')
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }
            const data=await res.json()
            // const { habits } = await res.json()
            console.log(data)
            setHabitsList(data.habits)
            console.log(data.habits)
            console.log("completed today", data.completedToday)
        } catch (error) {
            console.log("failed to fetch the today's habits", error)
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])

    return (
        <div className="bg-white rounded-3xl p-6 w-full max-w-170 border-2 border-b-8 border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 tracking-tighter">Today's plan</h2>
                <div className="flex items-center gap-1  rounded-xl p-1">
                    Habits
                </div>
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-2.5">
                {habitsList.map((habit) => (
                    <HabitCard habit={habit}/>
                ))}
            </div>
        </div>
    );
}