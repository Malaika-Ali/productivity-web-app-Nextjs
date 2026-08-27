export function CheckIcon({ done, active }) {
    if (done) {
        return (
            <div className="w-6 h-6 rounded-full bg-violet-400 flex items-center justify-center shrink-0">
                <svg width="13" height="20" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3.5 3.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }
    return (
        <div
            className={`w-6 h-6 rounded-full border-2 shrink-0 ${active ? "border-purple-500" : "border-gray-300"
                }`}
        />
    );
}