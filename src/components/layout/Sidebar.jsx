"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Flame, CalendarDays, Goal, ListChecks, Shell, ChartColumn, Sparkles } from 'lucide-react';

const navItems = [
    { label: "Today", active: true, icon: CalendarDays },
    { label: "Habits", badge: "7", badgeColor: "bg-purple-500", icon: Shell },
    { label: "Tasks", badge: "14", badgeColor: "bg-orange-400", icon: ListChecks },
    { label: "Goals", icon: Goal },
    { label: "Insights", icon: ChartColumn },
    { label: "Coach", isNew: true, icon: Sparkles },
];

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("Today");

    return (
        <div className="flex h-screen w-55 flex-col bg-white shadow-sm border-r border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 border-b-4 border-purple-700">
                    <span className="text-sm font-bold text-white">H</span>
                </div>
                <span className="text-[22px] font-bold text-gray-900 tracking-tight">Habitly</span>
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

                            {/* Badge or NEW tag */}
                            {item.badge && (
                                <span
                                    className={cn(
                                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white",
                                        item.badgeColor
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                            {item.isNew && (
                                <span className="rounded-full bg-orange-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                                    NEW
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        

              {/* Spacer */ }
    <div className="flex-1" />

    {/* Weekly Goal Card */ }
    <div className="mx-3 mb-3 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" }}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-1">
            Weekly Goal
        </p>
        <p className="text-[18px] font-extrabold text-white leading-tight mb-3">
            6 of 7 days
        </p>
        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-white/30">
            <div
                className="h-1.5 rounded-full bg-white"
                style={{ width: "85%" }}
            />
        </div>
    </div>

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
        <button className="flex flex-col items-center justify-center gap-[3px] p-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="h-[3px] w-[3px] rounded-full bg-gray-400" />
            <span className="h-[3px] w-[3px] rounded-full bg-gray-400" />
            <span className="h-[3px] w-[3px] rounded-full bg-gray-400" />
        </button>
    </div>
    </div>
    );
}