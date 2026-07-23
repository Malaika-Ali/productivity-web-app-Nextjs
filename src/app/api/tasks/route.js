import { createClient } from "@/lib/supabase/serverClient";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const supabase=await createClient()
        const {data: {user}}=await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            {error: "Unauthorized Request"}, {status: 401}
        )


        const body = await req.json()

        if (!body.title) return NextResponse.json(
            { error: 'Title is required' }, { status: 400 }
        )

        const {data, error}=await supabase
        .from('tasks')
        .insert({
            user_id: user.id,
            title: body.title,
            priority: body.priority || 'low',
            due_time: body.due_time || null,
            due_date: body.due_date || null,
        })

        if(error) throw error

        return NextResponse.json(
            {success: true}, {data}
        )
    } catch (error) {
        console.log("Internal server error while trying to save the task", error)
        return NextResponse.json(
            {error: "Internal Server error While Trying To Save The Task"}, {status: 500}
        )
    }
}