const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

// Forces Gemini to return exactly this shape — no markdown fences, no free text
// wrapping the JSON, no risk of the response being unparseable.
const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        summary: {
            type: "STRING",
            description: "A warm, specific 2-3 sentence summary of the user's week, referencing real numbers and habit/task names from the data.",
        },
        suggestions: {
            type: "ARRAY",
            items: { type: "STRING" },
            minItems: 2,
            maxItems: 3,
            description: "2-3 concrete, specific suggestions for next week, each one sentence, referencing specific habits/tasks by name where relevant.",
        },
    },
    required: ["summary", "suggestions"],
}

export async function generateInsight(stats) {
    const prompt = buildPrompt(stats)

    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.7,
            },
        }),
    })

    if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Gemini API error (${res.status}): ${errText}`)
    }

    const data = await res.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error("Gemini returned no content")

    const parsed = JSON.parse(rawText) // safe: responseSchema guarantees valid JSON matching the shape above

    if (!parsed.summary || !Array.isArray(parsed.suggestions)) {
        throw new Error("Gemini response did not match expected shape")
    }

    return parsed
}

function buildPrompt(stats) {
    const { habits, tasks, windowStart, windowEnd } = stats

    const habitLines = habits.list.length
        ? habits.list.map(h =>
            `- "${h.title}" (${h.category}): ${h.completed}/${h.scheduled} completed this week` +
            (h.completionRate !== null ? ` (${h.completionRate}%)` : " (not scheduled this week)") +
            `, current streak ${h.current_streak}, longest streak ${h.longest_streak}`
        ).join("\n")
        : "No habits tracked yet."

    const taskLines = tasks.total > 0
        ? `${tasks.completed}/${tasks.total} tasks completed (${tasks.completionRate}%), ${tasks.overdue} overdue.` +
        (tasks.byPriority.length
            ? " Breakdown by priority: " + tasks.byPriority.map(p => `${p.priority}: ${p.completed}/${p.total}`).join(", ")
            : "")
        : "No tasks due this week."

    return `You are a supportive, insightful habit and productivity coach writing a personalized weekly recap for a user of a habit-tracking app called Habitrea AI.

Here is their data for ${windowStart} to ${windowEnd}:

HABITS:
${habitLines}
Overall habit completion rate: ${habits.overallCompletionRate !== null ? habits.overallCompletionRate + "%" : "N/A"}
${habits.bestDay ? `Strongest day: ${habits.bestDay.day} (${habits.bestDay.rate}% completion)` : ""}
${habits.weakestDay ? `Weakest day: ${habits.weakestDay.day} (${habits.weakestDay.rate}% completion)` : ""}

TASKS:
${taskLines}

Write a short, warm, specific summary of their week (2-3 sentences) that references real numbers and actual habit/task names from the data above — not generic encouragement. Then give 2-3 concrete, actionable suggestions for next week, each grounded in a specific pattern from the data (e.g. a weak day, a low-performing habit, overdue tasks). Avoid clichés like "keep up the great work" without specifics. Do not use markdown formatting in the text — plain sentences only. If there isn't enough data yet, be honest and encouraging about that rather than inventing patterns.`
}