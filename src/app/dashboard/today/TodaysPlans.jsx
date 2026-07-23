"use client";
import { useEffect, useState } from "react";

import HabitCard from "./HabitCard";
import { useHabits } from "@/hooks/useHabits";

export default function TodaysPlans() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [habitsList, setHabitsList] = useState([])
    const [completedHabits, setCompletedHabits] = useState([])

    const { habits, toggleHabit } = useHabits()
    

    // const filtered = tasks.filter((t) => {
    //     if (activeFilter === "All") return true;
    //     if (activeFilter === "Habits") return t.type === "habit";
    //     if (activeFilter === "Tasks") return t.type === "task";
    //     return true;
    // });

    // const fetchHabits = async () => {
    //     try {
    //         const res = await fetch('/api/habits/today')
    //         if (!res.ok) {
    //             throw new Error(`HTTP ${res.status}`)
    //         }
    //         const data=await res.json()
    //         // const { habits } = await res.json()
    //         console.log(data)
    //         setHabitsList(data.habits)
    //         console.log(data.habits)
    //         console.log("completed today", data.completedToday)
    //     } catch (error) {
    //         console.log("failed to fetch the today's habits", error)
    //     }
    // }

    // useEffect(() => {
    //     fetchHabits()
    // }, [])

    const fetchTasks=async()=>{
        try {
            const res=await fetch("/api/tasks/today")
            if (!res.ok) throw new Error("fetch error")

            const tasks=await res.json()
            console.log("The fetched tasks list is", tasks)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchTasks()
    },[])

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
                {habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
                ))}
            </div>
        </div>
    );
}