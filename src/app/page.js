import Link from "next/link";
import {
  ArrowRight,
  Check,
  Flame,
  Play,
  Target,
  Brain,
  Zap,
  Minus,
  Star,
  MoreHorizontal,
} from "lucide-react";
import Footer from "./(marketing)/Footer";
import Logo from "./(marketing)/Logo";
import Image from 'next/image';
import dashboard from './dashboard.png'

const features = [
  {
    title: "AI Coach",
    description:
      "A coach in your pocket that learns your rhythm, reshuffles your week, and gently pulls you back when life happens.",
    icon: Brain,
    color: "violet",
  },
  {
    title: "Habit Streaks",
    description:
      "Tiny daily wins that compound. Visual streaks, freeze days, and a weekly reset so one off-day doesn’t undo a month.",
    icon: Flame,
    color: "amber",
  },
  {
    title: "Smart Tasks",
    description:
      "Dump your to-do list. Habitrea groups, schedules, and right-sizes it to the hours you actually have today.",
    icon: Zap,
    color: "pink",
  },
];

const steps = [
  {
    number: "01",
    title: "Set your goals",
    description:
      "Tell Habitrea what matters this season — fitness, focus, sleep, side-projects. In your own words.",
    color: "violet",
  },
  {
    number: "02",
    title: "AI builds your plan",
    description:
      "A weekly mix of habits and tasks, sized to your real calendar — never more than you can carry.",
    color: "amber",
  },
  {
    number: "03",
    title: "Track and improve",
    description:
      "Check things off, watch streaks grow, and let the coach adapt next week to what actually worked.",
    color: "pink",
  },
];

const freeFeatures = [
  "Up to 5 habits & 30 tasks",
  "Streaks, freeze days, weekly review",
  "iOS, Android, Web",
];
const proFeatures = [
  "Unlimited habits & tasks",
  "AI Coach — full daily planning",
  "Calendar & Notion sync",
  "Insights, themes, priority support",
];

// function Logo({ light = false }) {
//   return (

//   );
// }

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">
      {children}
    </p>
  );
}

function HabitDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="absolute -right-3 top-[-18px] size-16 rounded-full bg-amber-200" />
      <div className="absolute -bottom-5 -left-4 size-10 rounded-full bg-violet-200" />
      <div className="relative rounded-[26px] border border-violet-100 bg-white p-4 shadow-[0_22px_55px_-24px_rgba(124,58,237,0.3)] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500">Good morning, Maya</p>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
              Today&apos;s plan
            </h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-bold text-amber-800">
            <Flame className="size-3.5 fill-orange-500 text-orange-500" />
            12 day streak
          </span>
        </div>

        <div className="mb-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-violet-600 text-[10px] font-black text-white">
              AI
            </span>
            <span className="text-xs font-bold text-slate-800">Coach Note</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-600">
            You crushed Tuesday — let&apos;s keep the morning run, but I trimmed
            Thursday&apos;s reading to 15 min. Sustainable beats heroic.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
            <span className="flex size-5 items-center justify-center rounded-md bg-emerald-500 text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-400 line-through">
                Morning run · 20 min
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                Habit · Done
              </p>
            </div>
            <Flame className="size-4 fill-orange-500 text-orange-500" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-violet-400 px-3 py-2.5">
            <span className="size-5 rounded-md border border-violet-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-900">
                Write product brief
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-violet-600">
                Deep work · 45 min
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-extrabold text-amber-800">
              NOW
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
            <span className="size-5 rounded-md border border-slate-200" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800">Read · 15 min</p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                Habit · 4:30 PM
              </p>
            </div>
            <MoreHorizontal className="size-4 text-slate-300" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-600 to-violet-400 px-3 py-3 text-white">
          <div>
            <p className="text-[8px] font-extrabold uppercase tracking-wider text-violet-100">
              Weekly goal
            </p>
            <p className="text-[11px] font-bold">6 of 7 days on track</p>
          </div>
          <Target className="size-5 text-amber-200" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  const Icon = feature.icon;
  const styles = {
    violet: "bg-violet-600 shadow-[0_4px_0_#5b21b6] text-white border-violet-100",
    amber: "bg-amber-500 shadow-[0_4px_0_#b45309] text-white border-amber-100",
    pink: "bg-pink-500 shadow-[0_4px_0_#9d174d] text-white border-pink-100",
  };

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-[0_4px_0_rgba(124,58,237,0.10)] ${feature.color === "amber" ? "border-amber-200 shadow-[0_4px_0_rgba(251,191,36,0.55)]" : feature.color === "pink" ? "border-pink-200 shadow-[0_4px_0_rgba(244,114,182,0.4)]" : "border-violet-100"}`}>
      <div className={`mb-5 flex size-10 items-center justify-center rounded-xl ${styles[feature.color]}`}>
        <Icon className="size-5" />
      </div>
      <h3 className="mb-2 text-base font-extrabold tracking-tight text-slate-900">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
    </article>
  );
}

function PricingFeature({ children, muted = false }) {
  return (
    <li className={`flex items-start gap-2.5 text-xs ${muted ? "text-violet-200" : ""}`}>
      <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${muted ? "bg-violet-300/20 text-violet-200" : "bg-emerald-100 text-emerald-600"}`}>
        {muted ? <Minus className="size-3" /> : <Check className="size-3" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function MarketingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white">
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-semibold text-slate-600 transition hover:text-violet-600">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition hover:text-violet-600">How it works</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 transition hover:text-violet-600">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-slate-600 hover:text-violet-600 sm:inline-flex">
              Sign in
            </Link>
            <Link href="/signup" 
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_3px_0_#5b21b6] transition hover:-translate-y-0.5 hover:bg-purple-700">
            Free  Sign up <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10 lg:py-15">
        <div className="relative z-10">
          {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-extrabold text-amber-800">
            <span className="size-1.5 rounded-full bg-amber-500" />
            NEW — AI Coach 2.0 is here
          </div> */}
          <h1 className="max-w-xl text-5xl font-black leading-[0.99] tracking-[-0.055em] text-slate-900 sm:text-6xl lg:text-[clamp(3.6rem,5.2vw,5rem)]">
            Build habits.
            <br />
            Finish tasks.
            <br />
            <span className="text-violet-600">Grow daily.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Your friendly AI coach sets the plan, keeps the streak, and nudges
            you back when life gets in the way. One app for the habits and the
            tasks.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-xs font-extrabold text-white shadow-[0_4px_0_#5b21b6] transition hover:-translate-y-0.5 hover:bg-violet-700">
              Get started for free <ArrowRight className="size-4" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50">
              <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-white"><Play className="ml-0.5 size-2.5 fill-current" /></span>
              Watch demo
            </a>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex -space-x-2">
              <span className="size-5 rounded-full border-2 border-white bg-amber-400" />
              <span className="size-5 rounded-full border-2 border-white bg-violet-400" />
              <span className="size-5 rounded-full border-2 border-white bg-pink-400" />
              <span className="size-5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}
            </span>
            <span className="text-[10px] text-slate-500">Loved by 10+ early users</span>
          </div>
        </div>
        <div className="relative px-1 py-3 sm:px-5 lg:px-0">
           <div className="absolute -right-3 top-[-18px] size-16 rounded-full bg-amber-200" />
      <div className="absolute -bottom-5 -left-4 size-10 rounded-full bg-violet-200" />
      <div className="relative rounded-[26px] border border-violet-100 bg-white shadow-[0_22px_55px_-24px_rgba(124,58,237,0.3)] ">
          {/* <HabitDashboard /> */}
          <Image src={dashboard} alt="" className="rounded-xl w-full h-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50/80 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mx-auto mb-10 max-w-3xl text-center text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
            Less planning. More <span className="text-violet-600">doing.</span>
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => <FeatureCard key={feature.title} feature={feature} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-12 text-center text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
            Three steps. One better day.
          </h2>
          <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[17%] right-[17%] top-[30px] hidden border-t-2 border-dashed border-amber-200 md:block" />
            {steps.map((step) => (
              <article key={step.number} className="relative z-10 flex flex-col items-center text-center">
                <div className={`mb-5 flex size-[60px] items-center justify-center rounded-2xl text-2xl font-black text-white shadow-[0_5px_0] ${step.color === "violet" ? "bg-violet-600 shadow-violet-800" : step.color === "amber" ? "bg-amber-500 shadow-amber-700" : "bg-pink-500 shadow-pink-800"}`}>
                  {step.number}
                </div>
                <h3 className="mb-2 text-base font-extrabold tracking-tight">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-violet-50/80 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mx-auto mb-10 max-w-3xl text-center text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
            Start free. Upgrade when it sticks.
          </h2>
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2 md:gap-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="mb-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Free</p>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="mb-5 text-xs text-slate-600">Everything to start a daily practice.</p>
              <ul className="mb-7 space-y-2.5">
                {freeFeatures.map((item) => <PricingFeature key={item}>{item}</PricingFeature>)}
                <PricingFeature muted>AI Coach (3 nudges / week)</PricingFeature>
              </ul>
              <Link href="/signup" className="flex w-full items-center justify-center rounded-xl border border-slate-400 px-4 py-3 text-xs font-extrabold transition hover:border-violet-500 hover:bg-violet-50">
                Get started free
              </Link>
            </article>

            <article className="relative rounded-3xl border border-violet-600 bg-violet-600 p-6 text-white shadow-[0_6px_0_#5b21b6] sm:p-8">
              <span className="absolute -top-3 right-5 rounded-full bg-amber-500 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-[0_2px_0_#b45309]">
                Most popular
              </span>
              <p className="mb-4 text-[10px] font-extrabold uppercase tracking-widest text-violet-200">Pro</p>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight">$8</span>
                <span className="text-xs text-violet-200">/ month</span>
              </div>
              <p className="mb-5 text-xs text-violet-100">For the people who want a coach in their corner.</p>
              <ul className="mb-7 space-y-2.5">
                {proFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-white">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white"><Check className="size-3" strokeWidth={3} /></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-violet-600 transition hover:bg-violet-50">
                Start 14-day Pro trial
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
   <Footer/>
    </main>
  );
}
