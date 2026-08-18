"use client"
import React from 'react'
import TaskCard from './TaskCard';
import { useTasks } from '@/hooks/useTasks';


const TodaysTasks = () => {
  const {tasks, toggleTask} = useTasks()
  return (
    <div className="bg-white rounded-3xl py-6 px-4 w-full 
        border-r-4 border-b-8 border-gray-200"
      style={{ borderRightWidth: '4px' }}>
      <div className="flex flex-col justify-between">
        <h3 className="text-base font-extrabold text-gray-900">Tasks</h3>
        <div className="flex flex-col py-4 gap-2.5">
          {tasks.length==0 ? 
          <p className='text-[13px] text-center text-gray-500'>No tasks scheduled for today</p>
          :
          tasks?.map((task) => (
            <TaskCard task={task}
             onToggle={toggleTask} 
             />
          ))}
        </div>
      </div>

    </div>
  )
}

export default TodaysTasks
