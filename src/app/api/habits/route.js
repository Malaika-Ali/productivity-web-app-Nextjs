import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabaseServer";
import { createHabit } from "@/lib/habits";

export async function POST(req){
    try {
        const supabase= createClient()
        const {data: {user}}=await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            {error: 'Unauthorized'}, {status: 401}
        )

        const body=await req.json()

        if (!body.title) return NextResponse.json(
            { error: 'Title is required' }, { status: 400 }
        )

        const habit = await createHabit(user.id, body)
        return NextResponse.json({ success: true, habit }, { status: 201 })

    } catch (error) {
        console.error('POST /api/habits error:', error)
        return NextResponse.json(
            { error: 'Failed to create habit' }, { status: 500 }
        )
    }
}