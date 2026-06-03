"use client"
import StepOne from '@/components/onboarding/StepOne'
import StepTwo from '@/components/onboarding/StepTwo'
import {useState} from 'react'

const page = () => {

    const [step, setStep] = useState(1)
  return (
    <>
          {step === 1 && <StepOne onComplete={() => setStep(2)} />}
          {step === 2 && <StepTwo />}
    </>
  )
}

export default page
