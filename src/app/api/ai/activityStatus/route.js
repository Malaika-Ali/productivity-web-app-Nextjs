import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/serverClient"

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }


        const { data: completions, error } = await supabase
            .from('habit_completions')
            .select('completed_on')
            .eq("user_id", user.id)
            .order('completed_on', { ascending: true })

        if (error) console.log(error)

        const firstActivityAt =
            completions?.[0]?.completed_on ?? null

        const totalActivityDays = [
            ...new Set(
                (completions ?? [])
                    .map((item) => item.completed_on)
                    .filter(Boolean)
                    .map((date) => date.split("T")[0])
            ),
        ]

        return NextResponse.json({ success: true, firstActivityAt, ActivityDays: totalActivityDays.length })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: 'Failed to load the user"s first activity day and total active days' }, { status: 500 }
        )
    }
}