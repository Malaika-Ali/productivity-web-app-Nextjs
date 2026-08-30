// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/serverClient";
// import { toLocalDateString } from "@/lib/parseTime";

// export async function GET(req) {
//     try {
//         const supabase = await createClient()
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//         const today = new Date()
//         let yesterday = new Date(today)
//         yesterday.setDate(yesterday.getDate() - 1)
//         let beforeYesterday = yesterday -1
//         const yesterdayIndex = yesterday.getDay()
//         yesterday = toLocalDateString(yesterday)
//         beforeYesterday=toLocalDateString(beforeYesterday)
        


//         const { data: last_streak_date, error: last_streak_date_error } =
//             await supabase
//                 .from('profiles')
//                 .select('last_streak_date, current_streak')
//                 .eq('id', user.id)
//                 .single()

//         if (last_streak_date_error) throw last_streak_date_error

//         if (last_streak_date.last_streak_date != yesterday) {
//             let current_streak = last_streak_date.current_streak
//             const { count: habitsCount, error: habitsCountError } = await supabase
//                 .from('habits')
//                 .select('*', { count: 'exact', head: true })
//                 .eq('user_id', user.id)
//                 .contains('target_days', [yesterdayIndex])

//             if (habitsCountError) throw habitsCountError

//             const { count: habitsCompletionsCount, error: habitsCompletionsCountError } = await supabase
//                 .from('habit_completions')
//                 .select('*', { count: 'exact', head: true })
//                 .eq('user_id', user.id)
//                 .eq('completed_on', yesterday)

//             if (habitsCompletionsCountError)
//                 throw habitsCompletionsCountError

//             if ((habitsCompletionsCount / habitsCount) * 100 >= 80) {
//                 current_streak += 1


//             } else {
//                 current_streak = 0
//             }

//             const { error: streak_update_error } = await supabase
//                 .from('profiles')
//                 .update({
//                     current_streak: current_streak,

//                     last_streak_date: yesterday
//                 })
//                 .eq('id', user.id)

//             if (streak_update_error) throw streak_update_error
//         }

//         const { data: current_streak_data, error: current_streak_error } =
//             await supabase
//                 .from('profiles')
//                 .select('current_streak')
//                 .eq('id', user.id)
//                 .single()

//         if (current_streak_error) throw current_streak_error

//         return NextResponse.json({
//             success: true,
//             current_streak: current_streak_data.current_streak
//         },
//             { status: 200 })

//     } catch (error) {
//         console.error('POST /api/habits/streak:', error)
//         return NextResponse.json({ error: 'Failed to load the current_streak from profiles table' }, { status: 500 })
//     }
// }






import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";
import { toLocalDateString } from "@/lib/parseTime";

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = toLocalDateString(yesterday)

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('last_streak_date, current_streak')
            .eq('id', user.id)
            .single()
        if (profileError) throw profileError

        let current_streak = profile.current_streak || 0
        let last_streak_date = profile.last_streak_date

        // Walk forward from the day AFTER whatever was last evaluated, through
        // yesterday — not just yesterday alone. This is what actually enforces
        // "consecutive": if there was a gap (user skipped a few days), every day
        // in that gap gets checked, and a single failed day resets the streak
        // from that point on, exactly like the real streak is supposed to work.
        const cursor = last_streak_date ? new Date(last_streak_date) : new Date(yesterday)
        if (last_streak_date) cursor.setDate(cursor.getDate() + 1)

        let iterations = 0
        while (toLocalDateString(cursor) <= yesterdayStr && iterations < 60) {
            const dateStr = toLocalDateString(cursor)
            const dayIndex = cursor.getDay()

            const { count: habitsCount, error: habitsCountError } = await supabase
                .from('habits')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .contains('target_days', [dayIndex])
            if (habitsCountError) throw habitsCountError

            if (habitsCount > 0) {
                const { count: habitsCompletionsCount, error: habitsCompletionsCountError } = await supabase
                    .from('habit_completions')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('completed_on', dateStr)
                if (habitsCompletionsCountError) throw habitsCompletionsCountError

                const rate = (habitsCompletionsCount / habitsCount) * 100
                current_streak = rate >= 80 ? current_streak + 1 : 0
            }
            // habitsCount === 0 → neutral day, streak carries over unchanged

            last_streak_date = dateStr
            cursor.setDate(cursor.getDate() + 1)
            iterations++
        }

        if (last_streak_date !== profile.last_streak_date) {
            const { error: streak_update_error } = await supabase
                .from('profiles')
                .update({ current_streak, last_streak_date })
                .eq('id', user.id)
            if (streak_update_error) throw streak_update_error
        }

        return NextResponse.json({ success: true, current_streak }, { status: 200 })

    } catch (error) {
        console.error('GET /api/streak error:', error)
        return NextResponse.json({ error: 'Failed to load the current_streak from profiles table' }, { status: 500 })
    }
}