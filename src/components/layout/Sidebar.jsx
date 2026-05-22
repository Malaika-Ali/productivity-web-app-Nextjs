import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
    { label: "Today", active: true },
    { label: "Habits", badge: "7", badgeColor: "bg-purple-500" },
    { label: "Tasks", badge: "14", badgeColor: "bg-orange-400" },
    { label: "Goals" },
    { label: "Insights" },
    { label: "Coach", isNew: true },
];

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("Today");

    return (
        <div className="flex h-screen w-[200px] flex-col bg-white shadow-sm border-r border-gray-100 font-sans">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                    <span className="text-sm font-bold text-white">H</span>
                </div>
                <span className="text-[17px] font-bold text-gray-900 tracking-tight">Habitly</span>
            </div>

            {/* Day Streak Card */}
            <div className="mx-3 mb-5 rounded-2xl bg-amber-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-0.5">
                    Day Streak
                </p>
                <div className="flex items-center gap-1.5">
                    <span className="text-lg">🔥</span>
                    <span className="text-xl font-extrabold text-gray-800">12 days</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-0.5 px-2">
                {navItems.map((item) => {
                    const isActive = activeItem === item.label;
                    return (
                        <button
                            key={item.label}
                            onClick={() => setActiveItem(item.label)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                                isActive
                                    ? "bg-purple-50"
                                    : "hover:bg-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                {/* Dot indicator */}
                                <span
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-colors duration-150",
                                        isActive ? "bg-purple-500" : "bg-gray-200"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[13.5px] font-medium",
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
        </div>
    );
}