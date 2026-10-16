import React from 'react'
import { SectionLabel } from './SectionLabel';
import Link from "next/link";
import {Check,Minus} from "lucide-react";

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

const Pricing = () => {
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
  return (
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
  )
}

export default Pricing
