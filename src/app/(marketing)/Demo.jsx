import Link from "next/link";
import { ArrowRight, Circle, Play, Sparkles } from "lucide-react";

export default function Demo() {
    return (
        <section
            id="demo"
            className="overflow-hidden bg-gradient-to-b from-white to-violet-50/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-14"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section heading */}
                <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">
                        <Sparkles className="size-3.5 text-amber-500" />
                        A closer look at Habitrea AI
                    </div>

                    <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Your daily routine,
                        <br className="hidden sm:block" />{" "}
                        <span className="text-purple-600">
                            made easier.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        See how Habitrea AI brings your habits, tasks, and AI-generated
                        insights together to help you keep track of your progress.
                    </p>
                </div>

                {/* Product video frame */}
                <div className="relative mx-auto max-w-6xl">
                    {/* Ambient glow */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-4 -z-10 rounded-[2rem] bg-violet-400/20 blur-2xl sm:-inset-6"
                    />

                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_80px_-28px_rgba(91,33,182,0.30)] sm:rounded-3xl">
                        {/* Browser-style toolbar */}
                        <div className="flex h-11 items-center gap-3 border-b border-slate-100 bg-white px-3 sm:h-12 sm:px-5">
                            <div className="flex shrink-0 items-center gap-1.5">
                                <Circle className="size-2.5 fill-rose-400 text-rose-400" />
                                <Circle className="size-2.5 fill-amber-400 text-amber-400" />
                                <Circle className="size-2.5 fill-emerald-400 text-emerald-400" />
                            </div>

                            <div className="mx-auto flex max-w-sm flex-1 items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] text-slate-400 sm:text-xs">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Habitrea AI · Product tour
                            </div>

                            <span className="hidden text-[10px] font-semibold text-slate-400 sm:block">
                                Demo
                            </span>
                        </div>

                        {/* Video */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                            <video
                                className="absolute inset-0 size-full object-contain"
                                src="/videos/demo-video.mp4"
                                poster="/images/dashboard-full-view.png"
                                controls
                                muted
                                playsInline
                                preload="metadata"
                                aria-label="Habitrea AI product walkthrough"
                            >
                                Your browser does not support HTML video.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
