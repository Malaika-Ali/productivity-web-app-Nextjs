import Link from "next/link";
import { ArrowRight, Play, Star, } from "lucide-react";
import Footer from "./(marketing)/Footer";
import Image from 'next/image';
import dashboard from './dashboard.png'
import Steps from "./(marketing)/Steps";
import Pricing from "./(marketing)/Pricing";
import CTASection from "./(marketing)/CTASection";
import Features from "./(marketing)/Features";
import Nav from "./(marketing)/Nav";
import Demo from "./(marketing)/Demo";

export default function MarketingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* Navigation */}
      <Nav />

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
            <span className="text-purple-600">Grow daily.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Your friendly AI coach sets the plan, keeps the streak, and nudges
            you back when life gets in the way. One app for the habits and the
            tasks.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-xs font-extrabold text-white shadow-[0_4px_0_#5b21b6] transition hover:-translate-y-0.5 hover:bg-purple-700">
              Get started for free <ArrowRight className="size-4" />
            </Link>
            <a href="#demo" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50">
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

      {/* Video Demo */}
      <Demo/>

      {/* Features */}
      <Features />

      {/* How it works */}
      <Steps />

      {/* Pricing */}
      {/* <Pricing/> */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
