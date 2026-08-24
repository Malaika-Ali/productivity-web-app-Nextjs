import TaskPriorityIndicator from '@/components/taskPriorityIndicator/TaskPriorityIndicator';
import { getDueLabel } from '@/lib/parseTime';
import React from 'react'
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
    }
    return (
        <div
            className={`w-6 h-6 rounded-md border-2 shrink-0 ${active ? "border-purple-500" : "border-gray-300"
                }`}
        />
    );
}

const TaskCard = ({ task, onToggle}) => {
  return (
     <div
              key={task.id}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-200 ease-in-out 
                 ${task.completedToday ? "bg-gray-100" : ""} ${task.active
                  ? "border-purple-500 bg-white shadow-[0_0_0_1px_rgba(168,85,247,0.2)] border-2"
                  : "border-gray-100 bg-gray-50/60"
                  }`}
          >
       
              {/* Left: checkbox + text */}
              <div className='flex items-center gap-3 min-w-0 '>
           
         <TaskPriorityIndicator task={task}/>
                  <button
                      onClick={() => onToggle(task.id, task.completedToday)}
                      className="cursor-pointer"
                  >
                  <CheckIcon done={task.completedToday} active={task.active} />
                  </button>
                  <div className="min-w-0">
                      <p
                          className={`text-sm font-bold leading-snug ${task.completedToday ? "line-through text-gray-400" : "text-gray-800"
                              }`}
                      >
                          {task?.title}
                      </p>
                  </div>
              </div>
    
              {/* Due Date badge */}
              <div className="ml-4 shrink-0">
                  <span className="text-[13px] text-gray-400 font-semibold tracking-tight">
                 {
                  task?.status=="completed" ? "Done" : getDueLabel(task?.due_date)
                 }
                  </span>
              </div>
          </div>
  )
}

export default TaskCard
