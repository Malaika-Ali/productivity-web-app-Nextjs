import { categoryColors } from '@/constants';
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
const HabitCard = ({habit}) => {
  return (
      <div
          key={habit.id}
          className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${habit.active
              ? "border-purple-500 bg-white shadow-[0_0_0_1px_rgba(168,85,247,0.2)] border-2"
              : "border-gray-100 bg-gray-50/60"
              }`}
      >
          {/* Left: checkbox + text */}
          <div className="flex items-center gap-3 min-w-0">
              <CheckIcon done={habit.done} active={habit.active} />
              <div className="min-w-0">
                  <p
                      className={`text-sm font-bold leading-snug ${habit.done ? "line-through text-gray-400" : "text-gray-800"
                          }`}
                  >
                      {habit.title}
                  </p>
                  <p className={`text-[11px] font-extrabold mt-0.5 tracking-wide ${categoryColors[habit.category]}`}>
                      {/* {habit.meta.join(" · ")} */}
                      {habit.category}
                  </p>
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
               <span className="text-[13px] text-gray-400 font-semibold tracking-tight">{habit.preferred_time}</span>
          </div>
      </div>
  )
}

export default HabitCard
