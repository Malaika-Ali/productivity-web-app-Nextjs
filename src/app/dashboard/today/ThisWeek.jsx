// ThisWeek.jsx
// Dependencies: Tailwind CSS
// Place in: components/ThisWeek.jsx
// No recharts needed — pure CSS bar chart for pixel-perfect match

"use client";

const days = [
    { label: "M", value: 7, max: 7, state: "full" },
    { label: "T", value: 6, max: 7, state: "full" },
    { label: "W", value: 4, max: 7, state: "partial" }, // today — split purple/amber
    { label: "T", label2: "T", value: 0, max: 7, state: "empty" },
    { label: "F", value: 0, max: 7, state: "empty" },
    { label: "S", value: 0, max: 7, state: "empty" },
    { label: "S", value: 0, max: 7, state: "empty" },
];

const BAR_HEIGHT = 100; // px, max bar height

function Bar({ day, isToday }) {
    const fillPercent = day.value / day.max;

    return (
        <div className="flex flex-col items-center gap-2 flex-1">
            {/* Bar container */}
            <div
                className="w-full rounded-xl overflow-hidden flex flex-col justify-end relative"
                style={{ height: BAR_HEIGHT, minWidth: 36 }}
            >
                {/* Empty background */}
                <div className="absolute inset-0 bg-gray-100 rounded-xl" />

                {isToday ? (
                    // Today: split bar — bottom amber, top purple, with border
                    <div
                        className="relative z-10 w-full rounded-xl border-2 border-amber-400 overflow-hidden flex flex-col justify-end"
                        style={{ height: BAR_HEIGHT }}
                    >
                        {/* purple portion (top ~35%) */}
                        {/* <div
                            className="w-full bg-purple-500"
                            style={{ height: `${fillPercent * 60}%` }}
                        /> */}
                        {/* amber portion (bottom ~25%) */}
                        <div
                            className="w-full bg-amber-400 rounded-t-lg"
                            style={{ height: `${fillPercent * 60}%` }}
                        />
                    </div>
                ) : day.state === "full" ? (
                    <div
                        className="relative z-10 w-full bg-purple-500 rounded-xl"
                        style={{ height: `${fillPercent * 100}%` }}
                    />
                ) : (
                    // empty — just the bg
                    <div className="relative z-10 w-full" style={{ height: 0 }} />
                )}
            </div>

            {/* Day label */}
            <span
                className={`text-xs font-semibold ${isToday ? "text-amber-500" : "text-gray-400"
                    }`}
            >
                {day.label}
            </span>
        </div>
    );
}

export default function ThisWeek({
    dateRange = "Apr 21 – 27",
    bestDay = "Mon · 7/7",
    average = "5.3 / 7",
}) {
    return (
        <div className="bg-white rounded-3xl p-6 w-full 
        border-2 border-b-8 border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <h3 className="text-base font-extrabold text-gray-900">This week</h3>
                <span className="text-xs font-semibold bg-purple-100 px-2 py-1 rounded-full text-purple-800">{dateRange}</span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 mb-4">
                {days.map((day, i) => (
                    <Bar key={i} day={day} isToday={i === 2} />
                ))}
            </div>

            {/* Footer stats */}
            <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                        Best Day
                    </p>
                    <p className="text-sm font-bold text-gray-900">{bestDay}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                        Average
                    </p>
                    <p className="text-sm font-bold text-purple-500">{average}</p>
                </div>
            </div>
        </div>
    );
}