import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/ai/prompt'
import { createClient } from '@/lib/supabase/supabaseServer'

export async function POST(req) {
    try {
        // 1. Get user session
        const supabase = await createClient()  
        const { data: { user } ,error} = await supabase.auth.getUser()
        console.log("User:", user)
        console.log("Auth Error:", error)
        if (!user) return NextResponse.json(
            { error: 'Unauthorized' }, { status: 401 }
        )

        // 2. Parse request body
        const { goals, userName } = await req.json()
        if (!goals) return NextResponse.json(
            { error: 'Goals are required' }, { status: 400 }
        )

        // 3. Call Gemini API
        const habits = await generateHabitSuggestions(goals, userName)

        // 4. Return habits
        return NextResponse.json({ success: true, habits })

    } catch (error) {
        console.error('Suggest API error:', error)
        return NextResponse.json(
            { error: 'Failed to generate habits' }, { status: 500 }
        )
    }
}

async function generateHabitSuggestions(
    goals,
    userName
) {
//  const GEMINI_URL =
//         `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const prompt = buildPrompt(goals, userName)

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
                // response_mime_type: "application/json"
            }
        })
    })

    const data = await response.json()
    console.log("GEMINI FULL RESPONSE:", JSON.stringify(data, null, 2))
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    text = text.trim()

    // remove incomplete trailing JSON
    const lastValidBrace = text.lastIndexOf("}")
    const safeText = text.slice(0, lastValidBrace + 1)

    const parsed = JSON.parse(safeText)

    if (!text) throw new Error('No response from Gemini')
    // if (!text) console.log('No response from Gemini')


    // Strip markdown code fences if Gemini wraps in ```json
    // const clean = text
    //     .replace(/```json/g, '')
    //     .replace(/```/g, '')
    //     .trim()

    // const parsed = JSON.parse(clean)
    // return parsed.habits
    return parsed.habits
}