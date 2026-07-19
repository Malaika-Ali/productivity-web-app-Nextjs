import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function POST(req) {
    try {
        const supabase =await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: 'Unauthorized' }, { status: 401 }
        )

        const body = await req.json()

        if (!body.title) return NextResponse.json(
            { error: 'Title is required' }, { status: 400 }
        )

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                title: body.title,
                category: body.category || 'lifestyle',
                frequency: body.frequency || 'daily',
                target_days: body.target_days || [0, 1, 2, 3, 4, 5, 6],
                reminder_time: body.reminder_time || null,
                reminder_enabled: body.reminder_enabled || false,
                is_ai_suggested: body.is_ai_suggested || false
            })
            .select()
            .single()

        if (error) throw error
        // const habit = await createHabit(user.id, body)
        return NextResponse.json({ success: true, data }, { status: 201 })

    } catch (error) {
        console.error('POST /api/habits error:', error)
        return NextResponse.json(
            { error: 'Failed to create habit' }, { status: 500 }
        )
    }
}