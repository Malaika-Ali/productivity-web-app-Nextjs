"use client"
import React from 'react'
import { useEffect, useState } from "react";
import TaskCard from './TaskCard';
import { useTasks } from '@/hooks/useTasks';


const TodaysTasks = () => {

  // const [tasks, setTasks] = useState([])

  // const fetchTasks = async () => {
  //   try {
  //     const res = await fetch("/api/tasks/today")
  //     if (!res.ok) throw new Error("fetch error")

  //     const data = await res.json()
  //     console.log("The fetched tasks list is", data.data)
  //     setTasks(data.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchTasks()
  //   console.log("tasks state is ", tasks)
  // }, [])

  const {tasks, toggleTask} = useTasks()

  return (
    <div className="bg-white rounded-3xl py-6 px-4 w-full 
        border-r-4 border-b-8 border-gray-200"
      style={{ borderRightWidth: '4px' }}>
      <div className="flex flex-col justify-between">
        <h3 className="text-base font-extrabold text-gray-900">Tasks</h3>
        <div className="flex flex-col py-4 gap-2.5">
          {tasks?.map((task) => (
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
