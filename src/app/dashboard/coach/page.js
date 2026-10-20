import Link from "next/link";
import {
    ArrowLeft,
    BrainCircuit,
    Check,
    Lightbulb,
    MessageCircle,
    Sparkles,
} from "lucide-react";

export default function coach() {
    return (
        <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/30 blur-[100px] sm:size-[520px]"
            />

            <section className="mx-auto w-full max-w-2xl text-center">
                {/* Coming soon badge */}
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
                    <Sparkles className="size-3.5 text-amber-500" />
                    Your AI Coach is in progress
                </div>

                {/* Illustration */}
                <div className="relative mx-auto mb-8 flex size-32 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-violet-200/80" />
                    <div className="absolute inset-3 rounded-full border border-dashed border-violet-300/80" />

                    <div className="relative flex size-[76px] items-center justify-center rounded-[24px] bg-gradient-to-br from-violet-500 to-violet-700 shadow-xl shadow-violet-500/25">
                        <BrainCircuit className="size-10 text-white" />
                    </div>

                    <div className="absolute right-0 top-2 flex size-9 items-center justify-center rounded-xl border border-violet-100 bg-white shadow-md">
                        <Sparkles className="size-4 text-amber-500" />
                    </div>

                    <div className="absolute bottom-1 left-0 flex size-9 items-center justify-center rounded-xl border border-violet-100 bg-white shadow-md">
                        <MessageCircle className="size-4 text-violet-600" />
                    </div>
                </div>

                {/* Main message */}
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    Your next breakthrough
                    <span className="mt-1 block bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                        is taking shape.
                    </span>
                </h1>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                    Malaika Ali is building a space where you can talk through your goals,
                    understand your habits, and get guidance tailored to your progress.
                    A little more insight. A lot more momentum.
                </p>


                {/* Closing message */}
                <div className="mx-auto mt-8 flex max-w-lg items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-left">
                    <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600" />
                    <div>
                        <p className="text-sm font-bold text-slate-800">
                            In the meantime, keep showing up.
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                            Every habit you complete helps you build a clearer picture
                            of your progress.
                        </p>
                    </div>
                </div>

                <Link
                    href="/dashboard/today"
                    className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                    <ArrowLeft className="size-4" />
                    Back to dashboard
                </Link>
            </section>
        </main>
    );
}
