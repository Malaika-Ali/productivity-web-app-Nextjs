import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function POST(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: 'Unauthorized' }, { status: 401 }
        )

        const { habits } = await req.json()
        if (!habits?.length) return NextResponse.json(
            { error: 'No habits provided' }, { status: 400 }
        )

        const { error } = await supabase.rpc('complete_onboarding', {
            p_user_id: user.id,
            p_habits: habits
        })

        if (error) throw error

        return NextResponse.json({ success: true })

    } catch (error) {
        console.log("Onboarding error:", error.message)
        return NextResponse.json(
            { error: 'Failed to complete onboarding' }, { status: 500 }
        )
    }
}

export async function GET(req){
    try {
        const supabase=await createClient()
        const {data: {user}}=await supabase.auth.getUser()
        if(!user) return NextResponse.json(
            {error: 'unautorized Request'}, {status: 401}
        )

        const {data, error}=await supabase
        .from('habits')
        .select('*')

        if(!data) return NextResponse.json(
            {error: 'No habit Found'}, {status: 400}
        )
        
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: "Habits could not be fetched"}, {status: 500}
        )
    }
}