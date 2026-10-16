import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 via-purple-600 to-purple-700 px-5 py-12 text-center shadow-xl shadow-violet-200/50 sm:rounded-3xl sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                {/* Decorative background elements */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/10 blur-3xl sm:size-72"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-fuchsia-400/20 blur-3xl sm:size-72"
                />

                <div className="relative mx-auto flex max-w-3xl flex-col items-center">
                    {/* Badge */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs">
                        <Sparkles className="size-3.5 text-amber-300" />
                        Small steps. Real progress.
                    </div>

                    {/* Heading */}
                    <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Ready to achieve your {" "}
                        <span className="text-amber-300">
                            peak routine?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-sm leading-6 text-violet-100 sm:text-base sm:leading-7">
                        Turn your goals into daily habits, keep track of your tasks,
                        and discover insights that help you understand your progress.
                        Start building your routine with Habitrea AI.
                    </p>

                    {/* CTA Button */}
                    <Link
                        href="/signup"
                        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_4px_0_#d97706] transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_5px_0_#d97706] active:translate-y-0 active:shadow-[0_2px_0_#d97706] sm:w-auto sm:min-w-56"
                    >
                        Get Started Today
                        <ArrowRight className="size-4" />
                    </Link>

                    {/* Supporting text */}
                    <p className="mt-5 text-xs text-violet-200">
                        Start small. Stay consistent. Grow daily.
                    </p>
                </div>
            </div>
        </section>
    );
}