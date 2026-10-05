const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        insight: {
            type: "STRING",
            description:
                "A specific human-like behavioral insight in 1-3 sentences.",
        },
        whyItMatters: {
            type: "STRING",
            description:
                "Why this pattern matters for the user's behavior.",
        },
        hypothesis: {
            type: "STRING",
            description:
                "A cautious possible explanation. Clearly avoid claiming causation.",
        },
        recommendation: {
            type: "STRING",
            description:
                "One concrete action the user can take.",
        },
        experiment: {
            type: "STRING",
            description:
                "One small behavioral experiment for the next week.",
        },
        selectedPatternIndex: {
            type: "INTEGER",
            description:
                "Zero-based index of the strongest candidate.",
        },
    },
    required: [
        "insight",
        "whyItMatters",
        "hypothesis",
        "recommendation",
        "experiment",
        "selectedPatternIndex",
    ],
}

export async function generateInsight(patterns) {
    if (!patterns?.length) {
        return {
            insight:
                "Habitrea needs a little more activity before it can identify a reliable behavioral pattern.",
            whyItMatters:
                "A useful coach should be based on repeated behavior rather than a few isolated days.",
            hypothesis:
                "There is not enough evidence yet to form a meaningful behavioral hypothesis.",
            recommendation:
                "Keep logging your habits for another week.",
            experiment:
                "Continue your normal routine and let Habitrea collect more behavioral evidence.",
            selectedPatternIndex: null,
            selectedPattern: null,
        }
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured")
    }

    const prompt = buildPrompt(patterns)

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
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: RESPONSE_SCHEMA,
                    temperature: 0.45,
                    maxOutputTokens: 1200,
                },
            }),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
            `Gemini API error (${response.status}): ${errorText}`
        )
    }

    const data = await response.json()
    const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
        throw new Error("Gemini returned an empty response")
    }

    let parsed

    try {
        parsed = JSON.parse(rawText)
    } catch {
        throw new Error("Gemini returned invalid JSON")
    }

    validateResponse(parsed)

    let selectedIndex = parsed.selectedPatternIndex

    if (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= patterns.length
    ) {
        selectedIndex = 0
    }

    return {
        insight: parsed.insight.trim(),
        whyItMatters: parsed.whyItMatters.trim(),
        hypothesis: parsed.hypothesis.trim(),
        recommendation: parsed.recommendation.trim(),
        experiment: parsed.experiment.trim(),
        selectedPatternIndex: selectedIndex,
        selectedPattern: patterns[selectedIndex],
    }
}

function validateResponse(parsed) {
    const requiredStrings = [
        "insight",
        "whyItMatters",
        "hypothesis",
        "recommendation",
        "experiment",
    ]

    for (const field of requiredStrings) {
        if (
            typeof parsed?.[field] !== "string" ||
            !parsed[field].trim()
        ) {
            throw new Error(
                `Gemini response is missing ${field}`
            )
        }
    }
}

function buildPrompt(patterns) {
    const candidates = patterns.map((pattern, index) => ({
        index,
        type: pattern.type,
        habit: pattern.habitTitle || null,
        relatedHabit: pattern.relatedHabitTitle || null,
        evidence: pattern.evidence,
        confidence: pattern.confidence,
        finalScore: pattern.finalScore || pattern.score || 0,
    }))

    return `
You are Habitrea's long-term AI behavioral coach.

Your job is NOT to turn statistics into sentences.

Your job is to interpret evidence-backed behavioral findings and help the
user understand what may be making their habits easier or harder.

The candidates below were calculated by Habitrea's analytics engine.
They are the source of truth.

STRICT RULES:

1. Never invent numbers, habits, dates, causes, events, or user feelings.
2. Never claim that one habit CAUSED another. The data only shows behavioral
   association unless explicit experimental evidence is provided.
3. Do not simply repeat a completion percentage as the entire insight.
4. Prefer relationships, conditions, changes, triggers, overload, recovery,
   and recurring behavior over trivial calendar facts.
5. Explain what the pattern could mean for the user's routine.
6. Clearly label explanations as possibilities using phrases such as
   "may", "appears", "could", or "suggests".
7. Give ONE practical recommendation.
8. Give ONE small experiment that can be tested during the next week.
9. Do not give generic advice such as "try harder", "stay motivated", or
   "be consistent".
10. Do not mention that you are an AI.
11. No emojis and no markdown.
12. Write like a thoughtful coach who has observed the user's behavior over
    several weeks.

A strong example:

"Your coding habit appears to be much stronger on days when you work out.
You completed coding on 81% of workout days versus 29% of days when the
workout was missed."

Then the hypothesis should explain this cautiously:

"Your workout may be acting as a useful transition into a focused routine."

Then give one practical action and one measurable experiment.

Select the candidate that has the strongest combination of evidence,
actionability, novelty, and usefulness. Do not select a pattern merely
because it has a large number.

PATTERN CANDIDATES:

${JSON.stringify(candidates, null, 2)}

Return JSON using the provided response schema.
`
}
