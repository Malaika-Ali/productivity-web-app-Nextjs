import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req){
   try {
     const supabase=await createClient()
     const {data:{user}}=await supabase.auth.getUser()
     if(!user) return NextResponse.json(
         {error: "Unauthorized user"}, {status: 401}
     )
 
     const today = new Date().toISOString().split('T')[0]  // "2026-07-20"
     const todayDayIndex = new Date().getDay()  // 0-6
 
     const { data: habits, error } = await supabase
         .from('habits')
         .select('*, habit_completions(id, completed_on)')
         .eq('user_id', user.id)
         .contains('target_days', [todayDayIndex])

        //  if(error) throw new Error(error)
 
     const completedToday = habits.map(habit => ({
         ...habit,
         completedToday: habit.habit_completions.some(log => log.completed_on === today)
     }))

     return NextResponse.json({habits, completedToday})
 
   } catch (error) {
    return NextResponse.json(
        {error: "Could not fetch today's scheduled habits, Internal Server Error"}, {status: 500}
    )
   }

}