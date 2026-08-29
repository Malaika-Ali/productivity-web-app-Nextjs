'use client'
import { useState, useEffect, useRef } from "react"
import { Calendar, MoreVertical, CheckCircle2 } from "lucide-react"
import EditHabitModal from "../modals/HabitModal"
import { categoryColors } from "@/constants"

export function HabitCard({ habit, onToggle, onDelete, onHabitUpdated }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const menuRef = useRef(null)

  function formatTime(timeStr) {
    if (!timeStr) return ""
    const [hourStr, minuteStr] = timeStr.split(":")
    const hour = parseInt(hourStr)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${String(displayHour).padStart(2, "0")}:${minuteStr} ${period}`
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ebebf8] flex flex-col gap-4 relative">

        <div className="flex flex-col gap-1">
          <div className="flex w-full justify-between items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColors[habit.category]}`}>
              {habit.category}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-32">
                    <button
                      onClick={() => { setShowEditModal(true); setMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { onDelete(habit.id); setMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <h3 className="text-[17px] font-bold text-gray-900 mt-1">{habit.title}</h3>
            <span className="text-sm text-gray-400">{formatTime(habit.preferred_time)}</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={13} />
            <span className="text-xs">{habit.frequency}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full">
            🔥 {habit.current_streak} days
          </span>
        </div>
      </div>

      {showEditModal && (
        <EditHabitModal habit={habit} onClose={() => setShowEditModal(false)} onHabitUpdated={onHabitUpdated} />
      )}
    </>
  )
}