'use client'
import { useState } from "react"
import {Calendar, MoreVertical, CheckCircle2} from "lucide-react"

export function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ebebf8] flex flex-col gap-4 relative">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${habit.categoryColor}`}>
              {habit.category.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400">{habit.preferred_time}</span>
          </div>
          <h3 className="text-[17px] font-bold text-gray-900 mt-1">{habit.title}</h3>
        </div>

        {/* Streak + menu */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full">
            🔥 {habit.current_streak} days
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 w-32">
                <button
                  onClick={() => { onEdit(habit); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(habit.id); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion rate */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400">Completion Rate</span>
          <span className="text-xs font-bold text-[#4f46e5]">{habit.completionRate}%</span>
        </div>
        <div className="h-1.5 bg-[#ebebf8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4f46e5] rounded-full transition-all duration-500"
            style={{ width: `${habit.completionRate}%` }}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar size={13} />
          <span className="text-xs">{habit.frequency}</span>
        </div>
        <button
          onClick={() => onToggle(habit.id)}
          className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all
            ${habit.done
              ? "bg-[#4f46e5] text-white"
              : "bg-[#f0f0ff] text-[#4f46e5] hover:bg-[#e0e0fa]"
            }`}
        >
          {habit.done ? (
            <>Done <CheckCircle2 size={15} /></>
          ) : (
            "Complete"
          )}
        </button>
      </div>
    </div>
  )
}