function StarRating({ count = 5 }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} width="17" height="17" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M10 2l2 5.6H18l-4.9 3.6 1.9 5.8L10 14l-5 3 1.9-5.8L2 7.6h6L10 2z"
                        fill="#F59E0B"
                    />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialCard({
    stars = 5,
    quote = "I've tried every productivity app. This one actually changed my behavior.",
    author = "Sarah K.",
    avatarSrc = null,
    avatarInitial = "S",
}) {
    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <StarRating count={stars} />

            <p className="mt-4 text-white/88 text-[13.5px] italic leading-relaxed font-medium">
                &ldquo;{quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={author} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white text-sm font-bold">{avatarInitial}</span>
                    )}
                </div>
                <span className="text-white/75 text-[13px] font-semibold">— {author}</span>
            </div>
        </div>
    );
}