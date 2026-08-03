import React from 'react'
import StatsCardContainer from './StatsCardsContainer';
import TodaysPlans from './TodaysPlans';
import CoachNote from './CoachNote';
import ThisWeek from './ThisWeek';
import TodaysTasks from './TodaysTasks';
import TodayHeader from './TodayHeader';


export const metadata = {
    title: "Today",
};
const page = () => {
    return (
        <div className='flex flex-col  justify-center px-6'>
            {/* <StatsCardContainer /> */}
            <TodayHeader />
            <div className=" bg-purple-50/50 flex items-start justify-center flex-wrap my-6">


                <div className="flex flex-col lg:flex-row gap-5 w-full max-w-275 items-start">

                    {/* Left column — Today's Plan */}
                    <div className="w-full lg:flex-[1.4]">
                        <TodaysPlans />
                    </div>

                    {/* Right column — Coach note + This week */}
                    <div className="flex-1 flex flex-col gap-4">
                        <TodaysTasks />
                        <CoachNote />
                        {/* <ThisWeek /> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page
