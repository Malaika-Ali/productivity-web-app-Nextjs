import React from 'react'
import { SectionLabel } from './SectionLabel';

const Steps = () => {

    const steps = [
        {
            number: "01",
            title: "Tell us your goals",
            description:
                "Choose what you want to improve and share your interests during onboarding to get started with habits that fit your goals.",
            color: "violet",
        },
        {
            number: "02",
            title: "Get AI habit suggestions",
            description:
                "Habitrea AI suggests habits based on your onboarding responses. Choose the ones that work for you and make them part of your routine.",
            color: "amber",
        },
        {
            number: "03",
            title: "Track and learn",
            description:
                "Check off your habits, build streaks, and review AI-generated insights to discover patterns in your progress.",
            color: "pink",
        },
    ];

  return (
      <section id="how-it-works" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mb-12 text-center text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
                  Three steps. Disciplined
                  <span className="text-purple-600"> routine.</span>
              </h2>
              <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
                  <div className="absolute left-[17%] right-[17%] top-[30px] hidden border-t-2 border-dashed border-amber-200 md:block" />
                  {steps.map((step) => (
                      <article key={step.number} className="relative z-10 flex flex-col items-center text-center">
                          <div className={`mb-5 flex size-[60px] items-center justify-center rounded-2xl text-2xl font-black text-white shadow-[0_5px_0] ${step.color === "violet" ? "bg-purple-600 shadow-purple-800" : step.color === "amber" ? "bg-amber-500 shadow-amber-700" : "bg-pink-500 shadow-pink-800"}`}>
                              {step.number}
                          </div>
                          <h3 className="mb-2 text-base font-extrabold tracking-tight">{step.title}</h3>
                          <p className="max-w-xs text-sm leading-relaxed text-slate-600">{step.description}</p>
                      </article>
                  ))}
              </div>
          </div>
      </section>
  )
}
export default Steps
