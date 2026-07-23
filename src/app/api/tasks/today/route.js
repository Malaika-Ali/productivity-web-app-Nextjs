import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req) {
    try {
        const supabase=await createClient()
        const {data: {user}}= await supabase.auth.getUser()
        if(!user) return NextResponse(
            {error: "Unauthorized Request"}, {status: 401}
        )

        const today = new Date().toISOString().split('T')[0]  // "2026-07-20"
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .eq('due_date', today)
        if (error) throw error

        return NextResponse.json({ success: true, data})
    } catch (error) {
        console.log("Internal server error while fetching the tasks scheduled for today", error)
        return NextResponse.json(
            {error: "Internal Server Error"}, {status: 500}
        )
    }
}