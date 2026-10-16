import React from 'react'
import Link from "next/link";

const Logo = ({ light = false }) => {
  return (
      <Link href="/" className="inline-flex items-center gap-2" aria-label="Habitrea home">
          <span className="flex size-7 items-center justify-center rounded-sm bg-purple-600 text-base font-black text-white shadow-[0_3px_0_#5b21b6]">
              H
          </span>
          <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
              Habitrea AI
          </span>
      </Link>
  )
}

export default Logo
