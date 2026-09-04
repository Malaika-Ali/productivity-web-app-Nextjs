import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(req){
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json(
            { error: "Unauthorized user" }, { status: 401 }
        )

        const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

            if(error) throw error

        return NextResponse.json({ fullname:data, userId: user.id })
    } catch (error) {
        console.log("Error while fetching the users ful name")
        return NextResponse.json(
            { error: "Could not fetch the users full name" }, { status: 500 }
        )
    }
}