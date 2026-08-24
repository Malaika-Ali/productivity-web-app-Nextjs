import React from 'react'

const TaskPriorityIndicator = ({task}) => {
  return (
      <div className={`flex w-3 h-3 rounded-full shrink-0
               `}
          style={{ backgroundColor: task?.priority === 'high' ? '#fb2c36' : task?.priority === 'medium' ? '#eab308' : 'oklch(72.3% 0.219 149.579)' }}
      >

      </div>
  )
}

export default TaskPriorityIndicator
