import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";
import { decrementStreak, IncrementStreak } from "./streakCompute";
import { toLocalDateString } from "@/lib/parseTime";

export async function POST(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { habitId } = await req.json()
        if (!habitId) return NextResponse.json({ error: 'habitId is required' }, { status: 400 })

        const today = toLocalDateString(new Date())
        
        const { data, error } = await supabase
            .from('habit_completions')
            .insert({
                habit_id: habitId,
                user_id: user.id,
                completed_on: today
            })
            .select()
            .single()

        if (error) throw error

        const { current_streak } = await IncrementStreak(supabase, habitId, user.id)

        return NextResponse.json({ success: true, data, current_streak }, { status: 201 })

    } catch (error) {
        console.error('POST /api/habits/complete error:', error)
        return NextResponse.json({ error: 'Failed to mark habit complete' }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { habitId } = await req.json()
        if (!habitId) return NextResponse.json({ error: 'habitId is required' }, { status: 400 })

        const today = toLocalDateString(new Date())

        const { error } = await supabase
            .from('habit_completions')
            .delete()
            .eq('habit_id', habitId)
            .eq('user_id', user.id)
            .eq('completed_on', today)

        if (error) throw error

        const { current_streak } = await decrementStreak(supabase, habitId, user.id)

        console.log('The current streak is', current_streak)

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error('DELETE /api/habits/complete error:', error)
        return NextResponse.json({ error: 'Failed to unmark habit' }, { status: 500 })
    }
}