"use client"
import { useState } from "react"
import {
  Flame, Calendar, MoreVertical, CheckCircle2, Circle,
  Bell, Settings, Plus, Search, ChevronRight
} from "lucide-react"

const habits = [
  {
    id: 1,
    title: "Morning Meditation",
    category: "Health",
    categoryColor: "text-blue-500 bg-blue-50",
    time: "8:00 AM",
    streak: 12,
    completionRate: 78,
    frequency: "Daily",
    done: false,
  },
  {
    id: 2,
    title: "Deep Focus: Coding",
    category: "Learning",
    categoryColor: "text-purple-500 bg-purple-50",
    time: "6:30 PM",
    streak: 5,
    completionRate: 92,
    frequency: "Weekdays",
    done: true,
  },
  {
    id: 3,
    title: "Evening Run",
    category: "Health",
    categoryColor: "text-blue-500 bg-blue-50",
    time: "7:00 PM",
    streak: 21,
    completionRate: 85,
    frequency: "Daily",
    done: false,
  },
  {
    id: 4,
    title: "Read 20 Pages",
    category: "Learning",
    categoryColor: "text-purple-500 bg-purple-50",
    time: "9:00 PM",
    streak: 8,
    completionRate: 60,
    frequency: "Daily",
    done: false,
  },
]

// Generate a 5-row x ~26-col heatmap grid (≈ last 3 months)
function generateHeatmap() {
  const grid = []
  for (let row = 0; row < 7; row++) {
    const cols = []
    for (let col = 0; col < 26; col++) {
      const r = Math.random()
      let level = 0
      if (r > 0.65) level = 3
      else if (r > 0.45) level = 2
      else if (r > 0.28) level = 1
      cols.push(level)
    }
    grid.push(cols)
  }
  return grid
}

const heatmapData = generateHeatmap()

const heatmapColors = [
  "bg-[#e8e8f8]",
  "bg-[#a5a8e8]",
  "bg-[#6366c8]",
  "bg-[#3730a3]",
]

const filters = ["All", "Health", "Learning", "Work", "Personal"]

function HabitCard({ habit, onToggle, onEdit, onDelete }) {
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
            <span className="text-sm text-gray-400">{habit.time}</span>
          </div>
          <h3 className="text-[17px] font-bold text-gray-900 mt-1">{habit.title}</h3>
        </div>

        {/* Streak + menu */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full">
            🔥 {habit.streak} days
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

export default function HabitsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [habitList, setHabitList] = useState(habits)
  const [search, setSearch] = useState("")

  const filtered = habitList.filter(h => {
    const matchesFilter = activeFilter === "All" || h.category === activeFilter
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function toggleHabit(id) {
    setHabitList(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  function deleteHabit(id) {
    setHabitList(prev => prev.filter(h => h.id !== id))
  }

  function editHabit(habit) {
    // placeholder — wire to your modal/drawer
    alert(`Edit: ${habit.title}`)
  }

  return (
    <div className="min-h-screen">
      {/* Page content */}
      <main className="px-8 sm:px-6 py-8 flex flex-col gap-8">

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all
                ${activeFilter === f
                  ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                  : "bg-white text-gray-500 border-[#e0e0f0] hover:border-[#4f46e5] hover:text-[#4f46e5]"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Habit cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onEdit={editHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Circle size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No habits found. Add one to get started.</p>
          </div>
        )}

        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebebf8]">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Last 3 Months Activity</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Less</span>
              {heatmapColors.map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-1 min-w-[340px]">
              {heatmapData.map((row, ri) => (
                <div key={ri} className="flex gap-1">
                  {row.map((level, ci) => (
                    <div
                      key={ci}
                      className={`w-3 h-3 rounded-sm flex-shrink-0 ${heatmapColors[level]}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-3 text-xs text-gray-400 min-w-[340px]">
              <span>May</span>
              <span>June</span>
              <span>July</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}