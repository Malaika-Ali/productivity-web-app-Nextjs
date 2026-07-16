import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";
import { createHabit } from "@/lib/habits";

export async function PATCH(req, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json(
            { error: 'Unauthorized request' }, { status: 401 }
        )

        const { id } = await params
        if (!id) return NextResponse.json(
            { error: "habit Id Is required" }, { status: 400 }
        )

        let body
        try {
            body = await req.json()
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid request body" }, { status: 400 }
            )
        }
        // whitelisting editable fields
        const allowedFields = ['title', 'category', 'frequency', 'target_days', 'preferred_time', 'reminder_enabled']
        const updates = {}
        for (const field of allowedFields) {
            if (body[field] !== undefined) updates[field] = body[field]
        }

        if (Object.keys(updates).length === 0) return NextResponse.json(
            { error: "No valid habit fields to update" }, { status: 400 }
        )

        // validate fields if present
        const validCategories = ['health', 'learning', 'productivity', 'mindfulness', 'lifestyle']
        const validFrequencies = ['daily', 'weekdays', 'weekends']

        if (updates.category && !validCategories.includes(updates.category)) return NextResponse.json(
            { error: 'Invalid category' }, { status: 400 }
        )
        if (updates.frequency && !validFrequencies.includes(updates.frequency)) return NextResponse.json(
            { error: 'Invalid frequency' }, { status: 400 }
        )
        if (updates.title !== undefined && !updates.title.trim()) return NextResponse.json(
            { error: 'Title cannot be empty' }, { status: 400 }
        )

        const { data, error } = await supabase
            .from('habits')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error
        if (!data) return NextResponse.json(
            { error: 'Habit not found' }, { status: 404 }
        )

        return NextResponse.json({ success: true, habit: data })

    } catch (error) {
        console.error('[habit-update] error:', error.message)
        return NextResponse.json(
            { error: 'Failed to update habit' }, { status: 500 }
        )
    }
}