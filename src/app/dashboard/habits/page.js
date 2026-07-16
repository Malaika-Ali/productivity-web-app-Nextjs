"use client"
import { useEffect, useState } from "react"
import {Circle} from "lucide-react"
import {HabitCard} from "@/components/common/cards/HabitCard"
import { supabase } from "@/lib/supabase/browserClient"

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

const filters = ["All", "health", "learning", "minfulness", "productivity", "lifestyle"]

export default function HabitsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [habitList, setHabitList] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchHabits() {
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
        console.log(data)
        setHabitList(data)
      } catch (error) {
        console.log("Error occured while fetching habits of the user", error)
      }
    }
    fetchHabits()
  }, [])


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

  // function editHabit(habit) {
    // placeholder — wire to your modal/drawer
  //   alert(`Edit: ${habit.title}`)
  // }

  return (
    <div className="min-h-screen">
      {/* Page content */}
      <main className="px-8 sm:px-6 py-2 flex flex-col gap-8">

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all cursor-pointer
                ${activeFilter === f
                  ? "bg-primary text-white border-purple-500"
                  : "bg-white text-gray-500 border-[#e0e0f0] hover:border-primary hover:text-primary"
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
                // onEdit={editHabit}
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