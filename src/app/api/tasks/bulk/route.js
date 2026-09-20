import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

function toLocalDateString(date) {
    const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json(
            { error: 'Unauthorized Request' }, { status: 401 }
        )

        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get("limit") || "10", 10)
        const offset = parseInt(searchParams.get("offset") || "0", 10)
        const category = searchParams.get("category") || "all" // "completed" | "overdue" | "pending" | "all"

        const today = toLocalDateString(new Date())

        let query = supabase
            .from('tasks')
            .select('*', { count: "exact" })
            .eq("user_id", user.id)

        if (category === "completed") {
            query = query.eq("status", "completed").order("due_date", { ascending: false })
        } else if (category === "overdue") {
            query = query.eq("status", "todo").lt("due_date", today).order("due_date", { ascending: true }) // most overdue first
        } else if (category === "pending") {
            query = query.eq("status", "todo").gte("due_date", today).order("due_date", { ascending: true }) // soonest due first
        } else {
            query = query.order("due_date", { ascending: false })
        }

        const { data, error, count } = await query.range(offset, offset + limit - 1)

        if (error) throw error

        const hasMore = offset + data.length < count

        return NextResponse.json({ success: true, data, hasMore, total: count })
    } catch (error) {
        console.error("GET /api/tasks/bulk error:", error)
        return NextResponse.json(
            { error: "Tasks could not be fetched" }, { status: 500 }
        )
    }
}