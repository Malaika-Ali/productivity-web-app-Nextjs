"use client"
import { useEffect, useState } from "react"
import { Circle } from "lucide-react"
import { HabitCard } from "@/components/common/cards/HabitCard"
import HabitModal from "@/components/common/modals/HabitModal"
import HeatMap from "@/components/heatMap/HeatMap"

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
  const [showAddModal, setShowAddModal] = useState(false)

  async function fetchHabits() {
    try {
      const res = await fetch('/api/habits/bulk')
      const data = await res.json()
      console.log(data)
      setHabitList(data)
    } catch (error) {
      console.log("Error occured while fetching habits of the user", error)
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  useEffect(() => {
    function handleAddHabit() { setShowAddModal(true) }
    window.addEventListener('open-add-habit', handleAddHabit)
    return () => window.removeEventListener('open-add-habit', handleAddHabit)
  }, [])



  const filtered = habitList.filter(h => {
    const matchesFilter = activeFilter === "All" || h.category === activeFilter
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function toggleHabit(id) {
    setHabitList(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  async function deleteHabit(id) {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'DELETE'  
      })
      const data = await res.json()
      if (!res.ok) {
        console.error(data.error)
        return
      }
      fetchHabits()
    } catch (error) {
      console.log(error)
    }
  }

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
                onHabitUpdated={fetchHabits}
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
  

<HeatMap/>


      </main>

      {showAddModal && (
        <HabitModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onHabitUpdated={fetchHabits}  
        />
        )
        }
    </div>
  )
}