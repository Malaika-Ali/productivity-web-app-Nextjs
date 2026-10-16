import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
      <footer className="bg-slate-900 px-5 py-12 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
                  <div>
                      <Logo light />
                      <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-400">
                          The friendly AI coach for habits and tasks. 
                      </p>
                      <div className="mt-4 flex gap-2">
                          {["X", "in", "ig"].map((social) => (
                              <a key={social} href="#" aria-label={social} className="flex size-7 items-center justify-center rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 transition hover:bg-violet-600 hover:text-white">{social}</a>
                          ))}
                      </div>
                  </div>
                  {[
                      { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                      { title: "Company", links: ["About", "Manifesto", "Careers", "Press"] },
                      { title: "Resources", links: ["Habit guide", "Templates", "Help center", "Community"] },
                      { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
                  ].map((group) => (
                      <div key={group.title}>
                          <h3 className="mb-4 text-[10px] font-extrabold uppercase tracking-wider">{group.title}</h3>
                          <ul className="space-y-3">
                              {group.links.map((label) => <li key={label}><a href="#" className="text-xs text-slate-400 transition hover:text-white">{label}</a></li>)}
                          </ul>
                      </div>
                  ))}
              </div>
              <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <p>© {new Date().getFullYear()} Habitrea AI. Built with love by Malaika Ali Baig.</p>
                  <p>Made for the easily distracted.</p>
              </div>
          </div>
      </footer>
  )
}

export default Footer
