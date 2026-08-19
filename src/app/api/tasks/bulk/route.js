import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json(
            { error: 'unautorized Request' }, { status: 401 }
        )

        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get("limit") || "10", 10)
        const offset = parseInt(searchParams.get("offset") || "0", 10)

        const { data, error, count } = await supabase
            .from('tasks')
            .select('*', { count: "exact" })
            .eq("user_id", user.id)
            .order("due_date", { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) throw error

        const hasMore = offset + data.length < count

        if (!data) return NextResponse.json(
            { error: 'No Task Found' }, { status: 400 }
        )

        return NextResponse.json({success: true, data, hasMore, total: count})
    } catch (error) {
        return NextResponse.json(
            { error: "Tasks could not be fetched" }, { status: 500 }
        )
    }
}