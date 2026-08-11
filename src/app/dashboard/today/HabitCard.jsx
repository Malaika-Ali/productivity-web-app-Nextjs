import { categoryColorsText } from '@/constants';
import { parseTime } from '@/lib/parseTime';
import React from 'react'


function CheckIcon({ done, active }) {
    if (done) {
        return (
            <div className="w-6 h-6 rounded-full bg-violet-400 flex items-center justify-center shrink-0">
                <svg width="13" height="20" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3.5 3.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }
    return (
        <div
            className={`w-6 h-6 rounded-full border-2 shrink-0 ${active ? "border-purple-500" : "border-gray-300"
                }`}
        />
    );
}
const HabitCard = ({ habit, onToggle }) => {
    return (
        <div
            key={habit.id}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all  ${habit.completedToday ? "bg-gray-100" : ""} ${habit.active
                ? "border-purple-500 bg-white shadow-[0_0_0_1px_rgba(168,85,247,0.2)] border-2"
                : "border-gray-100 bg-gray-50/60"
                }`}
        >
            {/* Left: checkbox + text */}
            <div className={`flex items-center gap-3 min-w-0 `}>
                <button
                    onClick={() => onToggle(habit.id, habit.completedToday)}
                    className="cursor-pointer"
                >
                    <CheckIcon done={habit?.completedToday} active={habit.active} />
                </button>
                <div className="min-w-0">
                    <div className='flex justify-start gap-5 items-center'>
                    <p
                        className={`text-sm font-bold leading-snug ${habit.completedToday ? "line-through text-gray-400" : "text-gray-800"
                            }`}
                    >
                        {habit?.title}
                    </p>
                    <p className='text-[12px] font-extrabold mt-0.5 rounded-full bg-yellow-200 text-yellow-500 px-2 py-1'>
                        🔥  {habit?.current_streak} days
                    </p>
                    </div>
                    <div className='flex justify-start gap-5 items-center'>
                        <p className={`text-[12px] font-extrabold mt-0.5  capitalize ${categoryColorsText[habit.category]}`}>
                            {habit?.category}
                        </p>
                        {/* <p className='text-[12px] font-extrabold mt-0.5 rounded-full bg-yellow-200 text-yellow-500 px-2 py-1'>
                          🔥  {habit?.current_streak} days
                        </p> */}
                    </div>
                </div>
            </div>

            {/* Right: time or NOW badge */}
            <div className="ml-4 shrink-0">
                {/* {habit.timeBadge ? (
                  <span className="bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1 rounded-lg">
                      {habit.timeBadge}
                  </span>
              ) : (
                  <span className="text-[13px] text-gray-400 font-semibold tracking-tight">{habit.preferred_time}</span>
              )} */}
                <span className="text-[13px] text-gray-400 font-semibold tracking-tight">{habit?.preferred_time
                    ? (() => {
                        const { hour, minute, period } = parseTime(habit.preferred_time)
                        return `${hour}:${minute} ${period}`
                    })()
                    : "Anytime"
                }</span>
            </div>
        </div>
    )
}

export default HabitCard
