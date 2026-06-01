import AppLogo from "./AppLogo";
import FeatureList from "./FeatureList";
import TestimonialCard from "./TestimonialCard";

export default function AuthLeftPanel() {
    return (
        <aside
            className="hidden lg:flex flex-col w-130 shrink-0 min-h-screen relative overflow-hidden"
            style={{
                background: "linear-gradient(150deg, #6254d4 0%, #6b47d6 35%, #7c3aed 100%)",
            }}
        >
            {/* Decorative radial glow top-left */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 25% 18%, rgba(255,255,255,0.10) 0%, transparent 55%)",
                }}
            />
            {/* Decorative soft circle bottom-right */}
            <div
                className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: "rgba(0,0,0,0.10)" }}
            />

            <div className="relative z-10 flex flex-col h-full px-12 py-10">

                {/* Logo */}
                <AppLogo name="[APP NAME]" />

                {/* Hero headline */}
                <div className="mt-auto mb-12">
                    <h1 className="text-white font-black text-[46px] leading-[1.08] tracking-tight mb-10">
                        Build habits.<br />
                        Finish tasks.<br />
                        Grow daily.
                    </h1>
                    <FeatureList />
                </div>

                {/* Testimonial card pinned near the bottom */}
                <div className="mb-10">
                    <TestimonialCard
                        stars={5}
                        quote="I've tried every productivity app. This one actually changed my behavior."
                        author="Sarah K."
                        avatarInitial="S"
                    />
                </div>

            </div>
        </aside>
    );
}