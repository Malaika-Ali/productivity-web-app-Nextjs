import React from 'react'

const ButtonWithIcon = ({Icon, text, ...props}) => {
  return (
      <button className="flex items-center gap-1.5 rounded-xl bg-purple-600 border-b-6 border-r-6 border-purple-800 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-3 shadow-none cursor-pointer transition-all duration-200 ease-out"
      {...props}>
          <Icon className="h-4 w-4" color="white" fill="white" />
          {text}
      </button>
  )
}

export default ButtonWithIcon
