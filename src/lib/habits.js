import { createClient } from "./supabase/serverClient";
export async function createHabit(userid, habitData) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('habits')
        .insert({
            user_id: userid,
            title: habitData.title,
            category: habitData.category || 'lifestyle',
            frequency: habitData.frequency || 'daily',
            target_days: habitData.target_days || [0, 1, 2, 3, 4, 5, 6],
            reminder_time: habitData.reminder_time || null,
            reminder_enabled: habitData.reminder_enabled || false,
            is_ai_suggested: habitData.is_ai_suggested || false
        })
        .select()
        .single()

    if (error) throw error

    return data
}