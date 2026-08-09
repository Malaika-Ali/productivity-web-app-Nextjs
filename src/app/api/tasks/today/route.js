import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req) {
    try {
        const supabase=await createClient()
        const {data: {user}}= await supabase.auth.getUser()
        if(!user) return NextResponse(
            {error: "Unauthorized Request"}, {status: 401}
        )

        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)

        const todayStr = today.toISOString().split('T')[0]
        const tomorrowStr = tomorrow.toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .gte('due_date', todayStr)
            .lte('due_date', tomorrowStr)
        if (error) throw error

        return NextResponse.json({success: true, data})
    } catch (error) {
        console.log("Internal server error while fetching the tasks scheduled for today", error)
        return NextResponse.json(
            {error: "Internal Server Error"}, {status: 500}
        )
    }
}