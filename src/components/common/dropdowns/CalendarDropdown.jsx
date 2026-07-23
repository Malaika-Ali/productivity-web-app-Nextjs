"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_LABELS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
export default function CalendarDropdown({ selectedDate, onSelect }) {

    // Formats a Date -> "YYYY-MM-DD" for the DB, without timezone drift from toISOString()
    function toDbDate(date) {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }
    
    // Parses a "YYYY-MM-DD" string (or null) into a local Date, defaulting to today
    function parseDbDate(dateStr) {
        if (!dateStr) return new Date()
        const [y, m, d] = dateStr.split("-").map(Number)
        return new Date(y, m - 1, d)
    }
    
    function isSameDay(a, b) {
        return a.getFullYear() === b.getFullYear()
            && a.getMonth() === b.getMonth()
            && a.getDate() === b.getDate()
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return "No due date"
        const date = parseDbDate(dateStr)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
    
    const selected = selectedDate ? parseDbDate(selectedDate) : null
    const initial = selected || new Date()
    const [viewYear, setViewYear] = useState(initial.getFullYear())
    const [viewMonth, setViewMonth] = useState(initial.getMonth())

    const today = new Date()

    function goPrevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11)
            setViewYear(y => y - 1)
        } else {
            setViewMonth(m => m - 1)
        }
    }

    function goNextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0)
            setViewYear(y => y + 1)
        } else {
            setViewMonth(m => m + 1)
        }
    }

    const firstOfMonth = new Date(viewYear, viewMonth, 1)
    const startWeekday = firstOfMonth.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const cells = []
    for (let i = 0; i < startWeekday; i++) cells.push(null)
    for (let day = 1; day <= daysInMonth; day++) cells.push(day)

    return (
        <div className="bg-white border border-[#e0e0f0] rounded-2xl shadow-xl overflow-hidden">
            {/* Month header + nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <button
                    onClick={goPrevMonth}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-gray-800">
                    {MONTH_LABELS[viewMonth]} {viewYear}
                </span>
                <button
                    onClick={goNextMonth}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 px-3 pt-3">
                {WEEKDAY_LABELS.map((label, i) => (
                    <div key={i} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-400 uppercase">
                        {label}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                {cells.map((day, i) => {
                    if (day === null) return <div key={`blank-${i}`} className="h-9" />

                    const cellDate = new Date(viewYear, viewMonth, day)
                    const isSelected = selected && isSameDay(cellDate, selected)
                    const isToday = isSameDay(cellDate, today)

                    return (
                        <button
                            key={day}
                            onClick={() => onSelect(toDbDate(cellDate))}
                            className={`h-9 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center justify-center
                ${isSelected
                                    ? "bg-primary text-white font-semibold"
                                    : isToday
                                        ? "text-primary font-semibold hover:bg-gray-50"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {/* Footer actions */}
            <div className="p-3 border-t border-gray-100 flex gap-2">
                <button
                    onClick={() => onSelect(toDbDate(new Date()))}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    Today
                </button>
                <button
                    onClick={() => onSelect(null)}
                    className="py-2 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover cursor-pointer transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    )
}