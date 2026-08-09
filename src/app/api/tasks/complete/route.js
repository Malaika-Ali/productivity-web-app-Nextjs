import { createClient } from "@/lib/supabase/serverClient";
import { NextResponse } from "@/lib/supabase/serverClient";

export async function POST(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { taskId } = await req.json()
        if (!taskId) return NextResponse.json(
            { error: "task id is Missing" }, { status: 400 }
        )

        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                task_id: taskId,
                user_id: user.id,
                status: 'completed',
                completed_on: today
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data }, { status: 201 })
    } catch (error) {
        console.error('POST /api/tasks/complete error:', error)
        return NextResponse.json({ error: 'Failed to mark task complete' }, { status: 500 })
    }
}

async function DELETE(req) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { taskId } = await req.json()
        if (!taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })

        const today = new Date().toISOString().split('T')[0]

        const { error } = await supabase
            .from('tasks')
            .insert({
                status: 'todo',
                completed_on: null
            })
            .select()
            .single()

        if (error) throw error
        
        return NextResponse.json({ success: true }, { status: 200 })
            
    } catch (error) {
console.error('DELETE /api/tasks/complete error:', error)
        return NextResponse.json({ error: 'Failed to unmark Task' }, { status: 500 })
    }

}