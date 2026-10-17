import React from 'react'
import Link from "next/link";
import Logo from './Logo'
import { ArrowRight } from "lucide-react";


const Nav = () => {
  return (
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
  )
}

export default Nav
