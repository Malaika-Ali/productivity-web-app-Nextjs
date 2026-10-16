import React from 'react'
import { SectionLabel } from './SectionLabel'
import {
    Flame,
    Brain,
    Zap,
} from "lucide-react";

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

const features = [
    {
        title: "AI-Powered Insights",
        description:
            "Understand your habits and discover patterns in your progress. Get AI-generated insights that help you reflect on what needs attention.",
        icon: Brain,
        color: "violet",
    },
    {
        title: "Track Your Habits",
        description:
            "Build consistency one day at a time. Track daily habits, monitor your streaks, and review your progress to see how far you've come.",
        icon: Flame,
        color: "amber",
    },
    {
        title: "Manage Your Tasks",
        description:
            "Keep your tasks and habits in one place. Organize your tasks, track what you've completed, and make your daily progress easier to manage.",
        icon: Zap,
        color: "pink",
    },
];

const Features = () => {
  return (
      <section id="features" className="bg-slate-50/80 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
              <SectionLabel>Features</SectionLabel>
              <h2 className="mx-auto mb-10 max-w-3xl text-center text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
                  Less planning. More <span className="text-purple-600">doing.</span>
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                  {features.map((feature) => <FeatureCard key={feature.title} feature={feature} />)}
              </div>
          </div>
      </section>
  )
}

export default Features
