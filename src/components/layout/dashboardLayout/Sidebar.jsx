"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Flame, CalendarDays, Goal, ListChecks, ChartColumn, Sparkles } from 'lucide-react';

const navItems = [
    { label: "Today", active: true, icon: CalendarDays },
    { label: "Habits", icon: Goal },
    { label: "Tasks",  icon: ListChecks },
    { label: "Insights", icon: ChartColumn },
    { label: "Coach", isNew: true, icon: Sparkles },
];

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("Today");

    return (
        <div className="flex h-screen w-55 flex-col bg-sidebar-background shadow-sm border-r border-white/5 fixed left-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500 border-b-4 border-purple-700">
                    <span className="text-lg font-bold text-white">H</span>
                </div>
                <span className="text-[22px] font-bold text-gray-900 tracking-tight">Habitrea AI</span>
            </div>

            {/* Day Streak Card */}
            <div className="mx-3 mb-5 rounded-xl bg-amber-100 px-4 py-2 flex gap-2 border-2 border-amber-200">
                <span className="text-xl bg-amber-500 rounded-lg flex justify-center items-center h-9 w-9"><Flame color="white" fill="white" size={22}/></span>
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase  text-amber-700 tracking-wider">
                        Day Streak
                    </p>
                    <span className="text-md font-extrabold text-amber-800">12 days</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-0.5 px-2">
                {navItems.map((item) => {
                    const isActive = activeItem === item.label;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={() => setActiveItem(item.label)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-150 cursor-pointer",
                                isActive
                                    ? "bg-purple-100"
                                    : "hover:bg-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-2.5">                             
                                <Icon
                                    size={18}
                                    className={cn(
                                        "transition-colors duration-150 ",
                                        isActive ? "text-purple-500" : "text-gray-600"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[13.5px] font-semibold",
                                        isActive ? "text-purple-600" : "text-gray-500"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>                    
                        </button>
                    );
                })}
            </nav>
        

              {/* Spacer */ }
    <div className="flex-1" />

    {/* User Profile */ }
    <div className="mx-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 shrink-0">
                <span className="text-sm font-bold text-white">M</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-gray-800 leading-tight">
                    Maya Chen
                </span>
                <span className="text-[10px] text-gray-400 leading-tight">
                    Pro · Year 1
                </span>
            </div>
        </div>
        {/* Ellipsis menu */}
        <button className="flex flex-col items-center justify-center gap-0.75 p-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="h-0.75 w-0.75 rounded-full bg-gray-400" />
            <span className="h-0.75 w-0.75 rounded-full bg-gray-400" />
            <span className="h-0.75 w-0.75 rounded-full bg-gray-400" />
        </button>
    </div>
    </div>
    );
}