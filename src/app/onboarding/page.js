"use client"
import StepOne from '@/components/onboarding/StepOne'
import StepTwo from '@/components/onboarding/StepTwo'
import { useState, useEffect } from 'react'
// import { supabase } from '../../lib/supabase/supabaseClient'
import { createClient } from '@supabase/supabase-js'
const page = () => {

  const [step, setStep] = useState(1)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [habits, setHabits] = useState([])

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data:u } = await supabase.auth.getSession()

      console.log("session info:", u.session)
      // 1. Get the logged-in user's ID from auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 2. Get their full_name from your profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      console.log('Profile error:', error)  // add this to see exact error
      console.log('Profile data:', profile)

      if (profile) {
        // Extract first name only for a friendly greeting
        const firstName = profile.full_name?.split(' ')[0] || 'there'
        setUserName(firstName)
        setUserId(user.id)
      }

      // setLoading(false)
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
