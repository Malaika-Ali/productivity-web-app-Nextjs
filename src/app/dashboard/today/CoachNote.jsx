"use client";

import { Brain } from 'lucide-react';

export default function CoachNote({
    readTime = "2 MIN READ",
    title = "A note from your coach",
    message = "You've kept the morning run for 12 days — beautiful. I noticed reading slips after 9 PM, so I moved it to 4:30 today. Want me to trim Thursday too?",
    primaryAction = "Yes, trim it",
    secondaryAction = "Keep as-is",
    onPrimary = () => { },
    onSecondary = () => { },
}) {
    return (
        <div className="bg-purple-600 rounded-3xl p-6 w-full text-white relative overflow-hidden border-2 border-b-8 border-purple-800">
            {/* Subtle background circle for depth */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-purple-500/40 pointer-events-none" />
            <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-purple-700/40 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header row */}
                <div className="flex items-center gap-2.5 mb-3">
                    {/* Coach icon */}
                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <Brain color='white' fill='white' />
                    </div>
                    <div>
                        <p className="text-[12px] font-extrabold tracking-wide text-purple-300 uppercase">
                            COACH · {readTime}
                        </p>
                        <h3 className="text-base font-extrabold text-white leading-tight">{title}</h3>
                    </div>
                </div>

                {/* Message */}
                <p className="text-sm text-purple-100 leading-relaxed mb-5">{message}</p>

                {/* Actions row */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onPrimary}
                        className="bg-white text-purple-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        {primaryAction}
                    </button>
                    <button
                        onClick={onSecondary}
                        className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        {secondaryAction}
                    </button>
                    {/* Chevron */}
                    <div className="ml-auto w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}