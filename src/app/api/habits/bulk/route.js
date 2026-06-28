import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/supabaseServer";
import { createClient } from "@/lib/supabase/supabaseServer";

export async function POST(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: 'Unauthorized' }, { status: 401 }
        )
        const { habits } = await req.json()
        if (habits.length === 0) return NextResponse.json(
            { error: 'No habits provided' }, { status: 400 }
        )

        const habitRows = habits.map(habit => ({
            user_id: user.id,
            title: habit.title,
            category: habit.category || 'lifestyle',
            frequency: habit.frequency || 'daily',
            target_days: habit.target_days || [0, 1, 2, 3, 4, 5, 6],
            is_ai_suggested: true,
            reminder_enabled: false,
            current_streak: 0,
            longest_streak: 0,
        }))

        const { data, error } = await supabase
            .from('habits')
            .insert(habitRows)
            .select()

        if (error) throw error

        // Mark onboarding Complete
        await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id)

        return NextResponse.json({ success: true, habits: data })
    } catch (error) {
        console.log("Bul habits creation error:", error)
        return NextResponse.json(
            { error: 'Failed to save the habits suggested by AI Coach' }, { status: 500 }
        )
    }
}