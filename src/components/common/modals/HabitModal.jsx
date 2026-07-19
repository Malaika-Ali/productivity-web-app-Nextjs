"use client"
import { useState, useEffect, useRef } from "react"
import { X, Clock, Bell, ChevronDown } from "lucide-react"

const CATEGORIES = ["health", "learning", "productivity", "mindfulness", "lifestyle"]
const FREQUENCIES = ["daily", "weekdays", "weekends"]

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))
const PERIODS = ["AM", "PM"]

function parseTime(timeStr) {
    if (!timeStr) return { hour: "07", minute: "30", period: "AM" }

    // Handle 24-hour format from DB: "10:00:00" or "14:30:00"
    const dbMatch = timeStr.match(/^(\d{2}):(\d{2}):\d{2}$/)
    if (dbMatch) {
        const hour24 = parseInt(dbMatch[1])
        const minute = dbMatch[2]
        const period = hour24 >= 12 ? "PM" : "AM"
        const hour12 = hour24 % 12 || 12
        return {
            hour: String(hour12).padStart(2, "0"),
            minute,
            period
        }
    }

    // Handle display format: "10:00 AM"
    const displayMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (displayMatch) {
        return {
            hour: String(displayMatch[1]).padStart(2, "0"),
            minute: displayMatch[2],
            period: displayMatch[3].toUpperCase()
        }
    }

    return { hour: "07", minute: "30", period: "AM" }
}

// Scrollable column for time picker
function TimeColumn({ items, selected, onSelect }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const idx = items.indexOf(selected)
        if (idx !== -1) {
            el.scrollTop = idx * 40
        }
    }, [selected, items])

    return (
        <div
            ref={ref}
            className="flex flex-col overflow-y-auto h-[200px] w-52 scroll-smooth"
            
        >
            {/* spacer top */}
            <div className="h-[80px] shrink-0" />
            {items.map(item => (
                <button
                    key={item}
                    onClick={() => onSelect(item)}
                    className={`h-10 shrink-0 flex items-center justify-center text-sm font-semibold rounded-lg cursor-pointer transition-all
            ${selected === item
                            ? "bg-primary text-white"
                            : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {item}
                </button>
            ))}
            {/* spacer bottom */}
            <div className="h-[80px] shrink-0" />
        </div>
    )
}

export default function HabitModal({ habit=null, onClose, mode="edit", onHabitUpdated }) {
    const [title, setTitle] = useState(habit?.title || "")
    const [category, setCategory] = useState(habit?.category || "")
    const [frequency, setFrequency] = useState(habit?.frequency || "Daily")
    const [reminderEnabled, setReminderEnabled] = useState(habit?.reminder_enabled ?? true)
    const [saving, setSaving] = useState(false)
    const [timeOpen, setTimeOpen] = useState(false)
    const timeRef = useRef(null)

    const parsed = parseTime(habit?.preferred_time || "07:30 AM")
    const [hour, setHour] = useState(parsed.hour)
    const [minute, setMinute] = useState(parsed.minute)
    const [period, setPeriod] = useState(parsed.period)

    const displayTime = `${hour}:${minute} ${period}`

    function toDbTime(hour, minute, period) {
        let hour24 = parseInt(hour)
        if (period === "AM" && hour24 === 12) hour24 = 0
        if (period === "PM" && hour24 !== 12) hour24 += 12
        return `${String(hour24).padStart(2, "0")}:${minute}:00`
    }

    // Close time picker on outside click
    useEffect(() => {
        function handleClick(e) {
            if (timeRef.current && !timeRef.current.contains(e.target)) {
                setTimeOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // Close on backdrop click
    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose()
    }

    // Close on Escape key
    useEffect(() => {
        function onKey(e) { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    async function handleSave() {
        if (!title.trim()) return
        setSaving(true)
        const payload = {
            title,
            category,
            frequency,
            preferred_time: toDbTime(hour, minute, period),
            reminder_enabled: reminderEnabled,
        }


        const res = mode === "edit"
            ? await fetch(`/api/habits/${habit.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            : 
            await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

        const data = await res.json()
        if (!res.ok) console.error(data.error)
        setSaving(false)
        onHabitUpdated()
        onClose()
    }

    return (
        <div
            onClick={handleBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 cursor-default"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[580px] max-h-[97%] p-7 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === "edit" ? "Edit Habit" : "Add Habit"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Habit Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Habit Name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder={mode === "add" ? "e.g. Morning Run" : ""}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0e0f0] text-gray-800 placeholder-gray-400 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                  ${category == cat
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frequency */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">Frequency</label>
                    <div className="flex flex-wrap gap-2">
                        {FREQUENCIES.map(freq => (
                            <button
                                key={freq}
                                onClick={() => setFrequency(freq)}
                                className={`px-5 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                  ${frequency === freq
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {freq}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preferred Time */}
                <div className="flex flex-col gap-2" ref={timeRef}>
                    <label className="text-sm font-medium text-gray-700">Preferred Time</label>
                    <button
                        onClick={() => setTimeOpen(!timeOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all
              ${timeOpen
                                ? "border-primary ring-2 ring-[#4f46e5]/10"
                                : "border-[#e0e0f0] hover:border-primary/40"
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <Clock size={15} className="text-gray-400" />
                            <span className="text-gray-800 font-medium">{displayTime}</span>
                        </div>
                        <ChevronDown
                            size={15}
                            className={`text-gray-400 transition-transform duration-200 cursor-pointer ${timeOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Custom time picker dropdown */}
                    {timeOpen && (
                        <div className="bg-white border border-[#e0e0f0] rounded-2xl shadow-xl overflow-hidden">
                            {/* Column headers */}
                            <div className="grid grid-cols-3 border-b border-gray-100">
                                {["Hour", "Min", "Period"].map(label => (
                                    <div key={label} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Scroll columns */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100 relative">
                                {/* Highlight band */}
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-[#f0f0ff] pointer-events-none z-0 mx-2 rounded-lg" />

                                <div className="flex justify-center z-10">
                                    <TimeColumn items={HOURS} selected={hour} onSelect={setHour} />
                                </div>
                                <div className="flex justify-center z-10">
                                    <TimeColumn items={MINUTES} selected={minute} onSelect={setMinute} />
                                </div>
                                <div className="flex justify-center z-10">
                                    <TimeColumn items={PERIODS} selected={period} onSelect={setPeriod} />
                                </div>
                            </div>

                            {/* Done button */}
                            <div className="p-3 border-t border-gray-100">
                                <button
                                    onClick={() => setTimeOpen(false)}
                                    className="w-full py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover cursor-pointer transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reminder toggle */}
                {/* <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2.5">
                        <Bell size={18} className="text-[#4f46e5]" />
                        <span className="text-sm font-medium text-gray-700">Enable reminder</span>
                    </div>
                    <button
                        onClick={() => setReminderEnabled(!reminderEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200
              ${reminderEnabled ? "bg-[#4f46e5]" : "bg-gray-200"}`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                ${reminderEnabled ? "translate-x-6" : "translate-x-0"}`}
                        />
                    </button>
                </div> */}

                {/* Divider */}
                <div className="h-px bg-gray-100 -mx-7" />

                {/* Footer buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!title.trim() || saving}
                        className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Habit"}
                    </button>
                </div>

            </div>
        </div>
    )
}