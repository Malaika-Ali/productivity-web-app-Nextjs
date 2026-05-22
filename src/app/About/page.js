"use client"
import React from 'react'

const page = async({ params, searchParams }) => {
    console.log(await params)
    console.log(await searchParams)
  return (
    <div>
      This is the about page for testing
    </div>
  )
}

export default page
