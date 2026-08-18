"use client";
import HabitCard from "./HabitCard";
import { useHabits } from "@/hooks/useHabits";

export default function TodaysPlans() {
    const { habits, toggleHabit } = useHabits()
    
    return (
        <div className="bg-white rounded-3xl p-6 w-full max-w-170 border-b-8 border-r-4! border-gray-200"
            style={{ borderRightWidth: '4px' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 tracking-tighter">Today's plan</h2>
                <div className="flex items-center gap-1 font-bold  rounded-xl p-1">
                    Habits
                </div>
            </div>

            {/* Hbaits list */}
            <div className="flex flex-col gap-2.5">
                {habits.length == 0 ? 
                    <p className='text-[13px] text-center text-gray-500'>No habits scheduled for today</p>
                : habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
                ))}
            </div>
        </div>
    );
}