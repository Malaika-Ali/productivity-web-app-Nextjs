import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function PATCH(req, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { id } = await params
        const body = await req.json()

        // Only allow fields that make sense to update this way — avoids a stray
        // field in the request body accidentally overwriting something like user_id.
        const allowedFields = ["title", "priority", "due_date", "due_time", "status"]
        const updates = {}
        for (const key of allowedFields) {
            if (key in body) updates[key] = body[key]
        }

        // If status is flipping to completed, stamp when — this is what powers
        // the "before noon" style AI insight patterns once enough data builds up.
        if (updates.status === "completed") {
            updates.completed_at = new Date().toISOString()
        } else if (updates.status === "todo") {
            updates.completed_at = null
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", id)
            .eq("user_id", user.id) 
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("PATCH /api/tasks/[id] error:", error)
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { id } = await params

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/tasks/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }
}