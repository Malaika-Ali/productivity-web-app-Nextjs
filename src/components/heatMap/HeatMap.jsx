import React, { useEffect, useState } from 'react'

const heatmapColors = [
    "bg-[#e8e8f8]",
    "bg-[#a5a8e8]",
    "bg-[#6366c8]",
    "bg-[#3730a3]",
]

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Turns the flat { date, level } list into grid[dayOfWeek][weekIndex] = level,
// which matches this component's existing render structure: 7 outer rows
// (Sun-Sat), each containing one square per week — same visual layout as
// GitHub's contribution graph.
function buildGrid(flatData, startDateStr) {
    const startDate = new Date(startDateStr)
    const levelByDate = new Map(flatData.map(d => [d.date, d.level]))

    const totalDays = flatData.length
    const weekCount = Math.ceil(totalDays / 7)

    const grid = Array.from({ length: 7 }, () => Array(weekCount).fill(null))
    const monthLabels = Array(weekCount).fill("")

    let prevMonth = null
    for (let week = 0; week < weekCount; week++) {
        for (let day = 0; day < 7; day++) {
            const current = new Date(startDate)
            current.setDate(startDate.getDate() + week * 7 + day)
            const y = current.getFullYear(), m = String(current.getMonth() + 1).padStart(2, "0"), d = String(current.getDate()).padStart(2, "0")
            const dateStr = `${y}-${m}-${d}`

            if (levelByDate.has(dateStr)) {
                grid[day][week] = levelByDate.get(dateStr)
            }

            // Label the week a new month starts in — checked on day 0 (Sunday) of each week
            if (day === 0) {
                const monthIndex = current.getMonth()
                if (monthIndex !== prevMonth) {
                    monthLabels[week] = MONTH_NAMES[monthIndex]
                    prevMonth = monthIndex
                }
            }
        }
    }

    return { grid, monthLabels }
}

const HeatMap = () => {
    const [grid, setGrid] = useState(null)
    const [monthLabels, setMonthLabels] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHeatmap() {
            try {
                const res = await fetch('/api/habits/heatmap')
                const result = await res.json()
                if (!res.ok) throw new Error(result.error)

                const { grid, monthLabels } = buildGrid(result.data, result.startDate)
                setGrid(grid)
                setMonthLabels(monthLabels)
            } catch (err) {
                console.error("Failed to load heatmap:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchHeatmap()
    }, [])

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebebf8]">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Last 6 Months Activity</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>Less</span>
                    {heatmapColors.map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {loading && <p className="text-sm text-gray-400">Loading activity...</p>}

            {!loading && grid && (
                <div className="w-full">
                    <div className="flex flex-col gap-1 w-full">
                        {grid.map((row, ri) => (
                            <div
                                key={ri}
                                className="grid gap-1 w-full"
                                style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
                            >
                                {row.map((level, ci) => (
                                    <div
                                        key={ci}
                                        className={`aspect-square rounded-sm max-h-4 ${level === null ? "bg-transparent" : heatmapColors[level]}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Month labels — same grid as the squares above, so each label lands under its actual week column */}
                    <div
                        className="grid gap-1 w-full mt-3"
                        style={{ gridTemplateColumns: `repeat(${monthLabels.length}, minmax(0, 1fr))` }}
                    >
                        {monthLabels.map((label, i) => (
                            <span key={i} className="text-[14px] text-gray-400 truncate">
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeatMap