import React from 'react'
import { Check, Pencil, Trash2 } from "lucide-react";
import TaskPriorityIndicator from '@/components/taskPriorityIndicator/TaskPriorityIndicator';
import { getDueLabel } from '@/lib/parseTime';

const badgeStyles = {
    rose: "bg-rose-50 text-rose-500",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-500",
};

function CheckIcon({ done, active }) {
    if (done) {
        return (
            <div className="w-6 h-6 rounded-md bg-violet-400 flex items-center justify-center shrink-0 "
            >
                <svg width="13" height="20" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3.5 3.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }}

const TaskCard = ({ task, onToggle, onDelete }) => {
    const { title, done, badge } = task;


    
  return (
      <div
          className={`group flex items-center justify-between gap-3 rounded-xl border  pl-3 pr-3 py-4 sm:pl-4 sm:pr-4 shadow-sm border-[#ebebf8] border-l-4
            
        transition-all duration-300 ease-linear cursor-pointer 
        ${task.status == "completed" ? "  hover:border-l-gray-300 border-y-gray-100 border-r-gray-100 bg-violet-100" : "hover:border-l-purple-500 border-l-transparent border-gray-100 bg-white"}
      `}
      >
          {/* Left: checkbox + title */}
          <div className="flex items-center gap-3 min-w-0">
            <TaskPriorityIndicator task={task}/>
              <button
                  onClick={() => onToggle(task.id, task?.completedToday)}
                  aria-label={done ? "Mark task incomplete" : "Mark task complete"}
                  className={`
                    shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-colors 
                    cursor-pointer
            ${task.status=="completed" ? "bg-blue-500" : "border-2 border-gray-300 hover:border-blue-400"}
          `}
              >
                  {/* {done && <Check size={12} strokeWidth={3} className="text-white" />} */}
                  <CheckIcon done={task?.status=="completed"} active={task.active}/>
              </button>

              <p
                  className={`text-sm font-medium truncate sm:whitespace-normal sm:break-words
            ${task?.status=="completed" ? "line-through text-gray-400" : "text-gray-700"}
          `}
              >
                  {title}
              </p>
          </div>

          {/* Right: badge + actions */}
          <div className="flex items-center justify-start gap-2 shrink-0">
              {/* {badge && (
                

              )} */}
              {task?.status == "completed" ? <span
                  className="text-[12px] font-bold text-start text-gray-400">
                 Done
              </span> 
                  : <span
                      className="text-[12px] font-semibold px-2.5 py-1 text-gray-300">
                      {getDueLabel(task?.due_date)}
                  </span> 
              }

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
