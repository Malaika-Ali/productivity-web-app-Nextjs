import { Sparkles } from "lucide-react"

// Circular progress ring, drawn with SVG stroke-dasharray.
// size/strokeWidth are configurable so this can be reused at different scales.
function ProgressRing({ percent, size = 56, strokeWidth = 5 }) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
        <svg width={size} height={size} className="shrink-0 -rotate-90">
            {/* Track */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#ede9fe"
                strokeWidth={strokeWidth}
            />
            {/* Progress */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            {/* Percentage label — counter-rotated back upright since the circle itself is rotated -90deg */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800 text-[13px] font-bold rotate-90"
                style={{ transformOrigin: "center", transformBox: "fill-box" }}
            >
                {percent}%
            </text>
        </svg>
    )
}

export default function TodayHeader({
    percent = 70,
    // message = "You've hit your meditation goal 4 days early! You're on fire today.",
    message = "You've completed 1/3 habits today!",
}) {
    return (
        <div className="flex items-center gap-4 bg-white rounded-3xl border-l-4 border-l-purple-500  px-4 py-3.5"
            style={{ borderLeftColor: 'oklch(62.7% 0.265 303.9)' }}>
           

            <div className="flex items-start gap-2.5 min-w-0 bg-primary/5  rounded-xl px-3.5 py-2.5 flex-1">
                <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                    {/* {message} */}
                    You've completed <span className="font-bold text-violet-500">1/3</span> habits today! 
                </p>
            </div>

            <ProgressRing percent={percent} />
        </div>
    )
}