const DEFAULT_FEATURES = [
    "AI coach that learns your patterns",
    "Streaks that keep you accountable",
    "Tasks and habits — in one place",
];

function FeatureItem({ text }) {
    return (
        <li className="flex items-center gap-3.5">
            <span className="w-6.5 h-6.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="text-white/90 text-[15px] font-medium leading-snug">{text}</span>
        </li>
    );
}

export default function FeatureList({ features = DEFAULT_FEATURES }) {
    return (
        <ul className="flex flex-col gap-4">
            {features.map((f, i) => (
                <FeatureItem key={i} text={f} />
            ))}
        </ul>
    );
}