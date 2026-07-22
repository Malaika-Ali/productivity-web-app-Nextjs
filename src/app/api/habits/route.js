import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

const FREQUENCY_TO_DAYS = {
    daily: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [1, 2, 3, 4, 5],
    weekends: [0, 6],
};

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

        const frequency = body.frequency || 'daily'
        const target_days = body.target_days || FREQUENCY_TO_DAYS[frequency.toLowerCase()] || FREQUENCY_TO_DAYS.daily

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                title: body.title,
                category: body.category || 'lifestyle',
                frequency,
                target_days,
                preferred_time: body.preferred_time,
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