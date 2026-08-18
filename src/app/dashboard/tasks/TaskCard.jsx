import React from 'react'
import { Check, Pencil, Trash2 } from "lucide-react";

const badgeStyles = {
    rose: "bg-rose-50 text-rose-500",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-500",
};

const TaskCard = ({ task, onToggle, onDelete }) => {
    const { title, done, badge } = task;


    
  return (
      <div
          className={`group flex items-center justify-between gap-3 rounded-xl border bg-white pl-3 pr-3 py-3 sm:pl-4 sm:pr-4 transition-colors
        ${done ? "border-l-4 border-l-rose-400 border-y-gray-100 border-r-gray-100" : "border-l-4 border-l-transparent border-gray-100"}
      `}
      >
          {/* Left: checkbox + title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                  onClick={() => onToggle(task.id)}
                  aria-label={done ? "Mark task incomplete" : "Mark task complete"}
                  className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer
            ${done ? "bg-blue-500" : "border-2 border-gray-300 hover:border-blue-400"}
          `}
              >
                  {done && <Check size={12} strokeWidth={3} className="text-white" />}
              </button>

              <p
                  className={`text-sm font-medium truncate sm:whitespace-normal sm:break-words
            ${done ? "line-through text-gray-400" : "text-gray-700"}
          `}
              >
                  {title}
              </p>
          </div>

          {/* Right: badge + actions */}
          <div className="flex items-center gap-2 shrink-0">
              {badge && (
                  <span
                      className={`hidden xs:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap
                        //  ${badgeStyles[badge.tone]}
                         `}
                  >
                      {badge.label}
                  </span>
              )}

              {!done && (
                  <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                          aria-label="Edit task"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                      >
                          <Pencil size={14} />
                      </button>
                      <button
                          onClick={() => onDelete(task.id)}
                          aria-label="Delete task"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                          <Trash2 size={14} />
                      </button>
                  </div>
              )}
          </div>
      </div>
  )
}

export default TaskCard
