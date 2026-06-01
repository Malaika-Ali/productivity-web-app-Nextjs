export default function AppLogo({ name = "[APP NAME]" }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M10 1.5l2.2 5.8H18.5l-5 3.6 1.9 6-5.4-3.9-5.4 3.9 1.9-6-5-3.6h6.3L10 1.5z"
                        fill="white"
                        stroke="white"
                        strokeWidth="0.4"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span className="text-white font-bold text-[15px] tracking-wide">{name}</span>
        </div>
    );
}