import StatCard from "../../../components/common/cards/StatCard";
import CoachNote from "./CoachNote";

function HabitsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="1.8" fill="white" />
        </svg>
    );
}

function TasksIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function FocusIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
                d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="white"
                fillOpacity="0.25"
            />
        </svg>
    );
}

function TrendIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
                d="M3 17l5-5 4 4 7-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 9h4v4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const cards = [
    {
        id: "habits",
        icon: <HabitsIcon />,
        iconBg: "[background:linear-gradient(135deg,#a855f7,#7c3aed)]",
        iconBorder: "border-purple-800",
        borderColor: "border-purple-200",
        badge: "+3 vs yest.",
        badgeClass: "bg-green-100 text-green-600",
        value: "5",
        valueTotal: "7",
        label: "Habits today",
    },
    {
        id: "tasks",
        icon: <TasksIcon />,
        iconBg: "[background:linear-gradient(135deg,#f59e0b,#d97706)]",
        iconBorder: "border-amber-800",
        borderColor: "border-amber-200",
        badge: "on track",
        badgeClass: "bg-amber-100 text-amber-600",
        value: "9",
        valueTotal: "14",
        label: "Tasks done",
    },
    {
        id: "focus",
        icon: <FocusIcon />,
        iconBg: "[background:linear-gradient(135deg,#ec4899,#db2777)]",
        iconBorder:"border-pink-800",
        borderColor: "border-pink-200",
        badge: "2h 14m",
        badgeClass: "bg-pink-100 text-pink-500",
        value: "3",
        valueSuffix: "sessions",
        label: "Deep focus",
    },
    {
        id: "consistency",
        icon: <TrendIcon />,
        iconBg: "[background:linear-gradient(135deg,#22c55e,#16a34a)]",
        iconBorder: "border-green-800",
        borderColor: "border-green-200",
        badge: "+18%",
        badgeClass: "bg-green-100 text-green-600",
        value: "87",
        valueSuffix: "%",
        label: "Week consistency",
    },
];

export default function StatsCardContainer() {
    return (
        <div className="flex gap-4 bg-purple-50/40 rounded-3xl">
            {cards.map((card) => (
                <StatCard key={card.id} {...card} />
            ))}
            <CoachNote />

        </div>

    );
}