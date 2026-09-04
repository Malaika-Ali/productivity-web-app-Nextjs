"use client"
import StepOne from '@/components/onboarding/StepOne'
import StepTwo from '@/components/onboarding/StepTwo'
import { useState, useEffect } from 'react'
const page = () => {

  const [step, setStep] = useState(1)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [habits, setHabits] = useState([])

  useEffect(() => {
    async function fetchUser() {
      const res=await fetch("/api/user")
      const data=await res.json()
      if (!res.ok) throw new Error(data.error)
        console.log(data)
        const firstName=data?.fullname?.full_name?.split(' ')[0]
      setUserName(firstName)
      setUserId(data.userId)
    }
    fetchUser()
  }, [])

  // Called by StepOne when Gemini returns habits
  function handleHabitsGenerated(generatedHabits) {
    setHabits(generatedHabits) 
    setStep(2)                   
  }

  return (
    <>
      {step === 1 && <StepOne userName={userName}
        onHabitsGenerated={handleHabitsGenerated}
       />}
      {step === 2 && <StepTwo habits={habits}
        userId={userId}
        userName={userName} />}
    </>
  )
}

export default page
