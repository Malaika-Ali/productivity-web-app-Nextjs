import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
      <footer className="bg-purple-700 px-5 py-12 text-white rounded-t-4xl sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
                  <div>
                      <Logo light />
                      <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white">
                          The friendly AI coach for habits and tasks. 
                      </p>
                      <div className="mt-4 flex gap-2">
                          {["X", "in", "ig"].map((social) => (
                              <a key={social} href="#" aria-label={social} className="flex size-7 items-center justify-center rounded-lg bg-slate-800 text-[12px] font-bold text-white transition hover:bg-violet-600 hover:text-slate-300 transition duration-300 ease-in">{social}</a>
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
                          <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-wider">{group.title}</h3>
                          <ul className="space-y-1">
                              {group.links.map((label) => <li key={label}><a href="#" className="text-[12px] transition text-white hover:text-slate-300">{label}</a></li>)}
                          </ul>
                      </div>
                  ))}
              </div>
              <div className="mt-10 flex flex-col gap-3 border-t border-gray-500 pt-5 text-[12px] text-white sm:flex-row sm:items-center sm:justify-between">
                  <p>© {new Date().getFullYear()} Habitrea AI. Built with love by Malaika Ali Baig.</p>
                  <p>Made for the easily distracted.</p>
              </div>
          </div>
      </footer>
  )
}

export default Footer
