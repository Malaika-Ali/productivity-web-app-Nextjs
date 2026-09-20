"use client";

import { Check, Sparkles, CalendarDays, ListTodo } from "lucide-react";

export default function HabitreaLoader() {
    return (
        <div className="flex min-h-[400px] items-center justify-center overflow-hidden">
            <div className="relative h-72 w-72">

                {/* =========================
                    CENTER
                ========================== */}
                <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-violet-50">

                        {/* Progress ring */}
                        <div className="absolute inset-0 animate-spin-slow rounded-full border-[3px] border-transparent border-t-violet-600 border-r-violet-300" />

                        {/* Inner circle */}
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-200">
                            <Check
                                size={30}
                                strokeWidth={3}
                                className="text-white"
                            />
                        </div>
                    </div>
                </div>


                {/* =========================
                    CALENDAR CARD
                ========================== */}
                <div className="absolute left-1 top-10 animate-float-slow">
                    <div className="flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-2xl border border-violet-100 bg-white shadow-lg shadow-violet-100/60">
                        <CalendarDays
                            size={25}
                            className="text-violet-500"
                        />

                        <div className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-amber-400" />
                    </div>
                </div>


                {/* =========================
                    TASK CARD
                ========================== */}
                <div className="absolute bottom-7 left-7 animate-float">
                    <div className="flex h-16 w-16 rotate-[7deg] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60">

                        <ListTodo
                            size={22}
                            className="text-violet-500"
                        />

                        <div className="flex gap-1">
                            <span className="h-1.5 w-5 rounded-full bg-violet-100" />
                            <span className="h-1.5 w-3 rounded-full bg-amber-200" />
                        </div>
                    </div>
                </div>


                {/* =========================
                    AI SPARKLE
                ========================== */}
                <div className="absolute right-2 top-7 animate-float-fast">
                    <div className="flex h-14 w-14 rotate-[8deg] items-center justify-center rounded-2xl bg-amber-50 shadow-lg shadow-amber-100">
                        <Sparkles
                            size={26}
                            className="text-amber-500"
                        />
                    </div>
                </div>


                {/* =========================
                    SMALL FLOATING DOTS
                ========================== */}

                <span className="absolute left-20 top-2 h-2 w-2 animate-pulse rounded-full bg-violet-300" />

                <span className="absolute right-16 top-20 h-2 w-2 animate-pulse rounded-full bg-amber-300 [animation-delay:500ms]" />

                <span className="absolute bottom-12 right-2 h-2.5 w-2.5 animate-pulse rounded-full bg-violet-200 [animation-delay:800ms]" />

                <span className="absolute bottom-2 left-24 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300 [animation-delay:300ms]" />

            </div>
        </div>
    );
}