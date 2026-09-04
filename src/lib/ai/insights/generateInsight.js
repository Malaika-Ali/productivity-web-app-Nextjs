const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        insight: {
            type: "STRING",
            description:
                "A concise behavioral insight in 1-2 sentences based only on the provided data.",
        },
        recommendation: {
            type: "STRING",
            description:
                "One concrete and practical action based on the selected pattern.",
        },
        selectedPatternIndex: {
            type: "INTEGER",
            description:
                "The zero-based index of the selected pattern.",
        },
    },
    required: [
        "insight",
        "recommendation",
        "selectedPatternIndex",
    ],
}

export async function generateInsight(patterns) {
    if (!patterns || patterns.length === 0) {
        return {
            insight:
                "There is not enough activity data yet to identify a reliable behavioral pattern.",
            recommendation:
                "Keep logging your habits consistently so Habitrea can identify useful patterns.",
            selectedPatternIndex: null,
            selectedPattern: null,
        }
    }

    const prompt = buildPrompt(patterns)

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured"
        )
    }

    const response = await fetch(
        `${GEMINI_URL}?key=${apiKey}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],

                generationConfig: {
                    responseMimeType:
                        "application/json",

                    responseSchema:
                        RESPONSE_SCHEMA,

                    temperature: 0.3,

                    maxOutputTokens: 1000,
                },
            }),
        }
    )

    if (!response.ok) {
        const errorText =
            await response.text()

        throw new Error(
            `Gemini API error (${response.status}): ${errorText}`
        )
    }

    const data = await response.json()

    const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text

    console.log(
        "Gemini finish reason:",
        data?.candidates?.[0]?.finishReason
    )

    console.log(
        "Gemini raw response:",
        rawText
    )

    if (!rawText) {
        throw new Error(
            "Gemini returned an empty response"
        )
    }

    let parsed

    try {
        parsed = JSON.parse(rawText)
    } catch (error) {
        console.error(
            "Gemini returned invalid JSON:",
            rawText
        )

        throw new Error(
            "Gemini returned invalid JSON"
        )
    }

    if (
        typeof parsed.insight !== "string" ||
        typeof parsed.recommendation !== "string"
    ) {
        throw new Error(
            "Gemini response is missing insight or recommendation"
        )
    }

    let selectedIndex =
        parsed.selectedPatternIndex

    if (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= patterns.length
    ) {
        selectedIndex = 0
    }

    return {
        insight:
            parsed.insight.trim(),

        recommendation:
            parsed.recommendation.trim(),

        selectedPatternIndex:
            selectedIndex,

        selectedPattern:
            patterns[selectedIndex],
    }
}


function buildPrompt(patterns) {
    const patternData = patterns.map(
        (pattern, index) => {
            return {
                index,

                type:
                    pattern.type || null,

                habit:
                    pattern.habitTitle || null,

                evidence:
                    pattern.evidence || null,

                recommendationCandidate:
                    pattern.recommendation ||
                    null,

                confidence:
                    pattern.confidence ||
                    null,

                score:
                    pattern.score || 0,
            }
        }
    )

    return `
You are Habitrea AI Coach.

Your job is to find ONE useful behavioral pattern from the user's habit data.

You are NOT writing a weekly activity summary.

The pattern data was calculated from real user activity.

Use ONLY the information provided in the pattern candidates.

Do not invent:
- habit names
- numbers
- dates
- times
- completion rates
- causes
- psychological explanations

Do not simply say that the user completed or missed a habit.

Look for something actionable and meaningful.

Prioritize patterns in this order:

1. recurring_failure
2. declining_trend
3. time_of_day_pattern
4. day_of_week_pattern
5. positive_habit_relationship
6. improving_trend
7. streak_strength

For a positive habit relationship, describe it as a relationship or correlation.

For example:

"Your coding habit is more consistent on days when you exercise."

Do NOT claim:

"Exercising causes you to code."

INSIGHT RULES:

- Maximum 2 sentences.
- Explain what the user should notice.
- Be specific.
- Use the actual evidence.
- Do not use generic praise.
- Do not use emojis.
- Do not use markdown.
- Do not start with "This week" unless necessary.

RECOMMENDATION RULES:

- Give exactly ONE practical action.
- The recommendation must be supported by the selected pattern.
- Keep it realistic.
- Do not give multiple actions.

Return the zero-based index of the most useful pattern.

PATTERN CANDIDATES:

${JSON.stringify(patternData, null, 2)}

Return JSON using the required response schema.
`
}




