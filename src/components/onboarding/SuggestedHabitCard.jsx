import React from 'react'
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";


const SuggestedHabitCard = ({title, time, frequency, category, toggle, active}) => {
    const categoryColors = {
        health: "bg-green-500/20 text-green-400",
        learning: "bg-blue-500/20 text-blue-400",
        productivity: "bg-purple-500/20 text-purple-400",
        mindfulness: "bg-yellow-500/20 text-yellow-400",
        lifestyle: "bg-pink-500/20 text-pink-400",
    }
  return (
      <button
          key={title}
          onClick={() => toggle(title)}
          className={cn(
              "relative text-left rounded-2xl px-4 pt-4 pb-4 border transition-all duration-200 cursor-pointer group",
              active
                  ? "border-violet-500/60 bg-violet-600/20 shadow-lg shadow-violet-900/30"
                  : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06] hover:border-white/20"
          )}
      >
          {/* Checkbox */}
          <div
              className={cn(
                  "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  active
                      ? "border-violet-400 bg-violet-500"
                      : "border-white/20 bg-transparent group-hover:border-white/40"
              )}
          >
              {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          {/* Label */}
          <p className={cn(
              "text-[18px] font-semibold mb-2 transition-colors",
              active ? "text-white" : "text-white/85"
          )}>
              {title}
          </p>
          {/* preferred time */}
          <span className="flex justify-start gap-2 items-center text-white/75 text-sm mt-3">
              <Clock size={18} />
              Preferred Time:</span>
          <div className="bg-violet-600/10 border border-violet-400 rounded-lg text-purple-300 px-2 py-1 mt-2 mb-4">{time}
          </div>

          {/* Badges row */}<div className="flex gap-2 flex-wrap">

              {/* Frequency badge */}
              <span
                  className={cn(
                      "inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium transition-all",
                      active
                          ? "bg-violet-500/25 border-violet-400/40 text-violet-300"
                          : "bg-white/5 border-white/15 text-white/40"
                  )}
              >
                  {frequency}
              </span>

              <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[category]}`}>
                  {category}
              </span>
          </div>
      </button>
  );
}

export default SuggestedHabitCard
