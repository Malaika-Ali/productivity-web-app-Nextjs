import React from 'react'
import StatsCardContainer from './StatsCardsContainer';
import TodaysPlans from './TodaysPlans';
import CoachNote from './CoachNote';
import ThisWeek from './ThisWeek';


export const metadata = {
    title: "Today",
};
const page = () => {
  return (
    <div>
        <StatsCardContainer/>
   
      <div className="min-h-screen bg-purple-50/50 flex items-start justify-center p-8">

        
          <div className="flex gap-5 w-full max-w-275 items-start">

              {/* Left column — Today's Plan */}
              <div className="flex-[1.4] min-w-0">
                  <TodaysPlans />
              </div>

              {/* Right column — Coach note + This week */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <CoachNote />
                  <ThisWeek />
              </div>

          </div>
      </div>
      </div>
  )
}

export default page
