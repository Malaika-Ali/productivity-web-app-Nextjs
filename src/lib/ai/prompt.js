// export function buildPrompt(goals, userName) {
//     return `You are an expert habit coach for a productivity app called Habitrea AI.

// A user named ${userName} has shared their goals: "${goals}"

// Your task is to suggest exactly 3 personalised daily habits based on their goals.

// STRICT RULES:
// - Return ONLY a valid JSON object. No explanation, no markdown, no extra text. Keep titles short. No code blocks.
// - Each habit must be realistic and achievable for a beginner.
// - Habits must be specific, not vague. "Workout 30 mins" not "Exercise more".
// - Category must be one of: health, learning, productivity, mindfulness, lifestyle.
// - Frequency must be: daily, weekdays, or weekends.
// Return this exact JSON structure:
// {
//   "habits": [
//     {
//       "title": "Workout 30 mins",
//       "category": "health",
//       "frequency": "daily",
//       "target_days": [0,1,2,3,4,5,6]
//     }

//   ]
// }

// Generate 5 habits now for ${userName} based on their goals: "${goals}"`
// }



// {
//   "title": "Read 20 pages",
//   "category": "learning",
//   "frequency": "daily",
//   "target_days": [0,1,2,3,4,5,6]
// }

// - target_days for daily = [0,1,2,3,4,5,6], weekdays = [1,2,3,4,5], weekends = [0,6].


export function buildPrompt(goals, userName) {
  return `
You are a habit coach.
User: ${userName}
Goals: ${goals}
Return ONLY valid JSON.
Rules:
- exactly 3 habits
- short titles (max 5 words)
- no markdown
- no explanations
- time must be a realistic suggested time for that habit in 12-hour format e.g. "07:00 AM"
Format:
{
  "habits": [
    {
      "title": "",
      "category": "health | learning | productivity | mindfulness | lifestyle",
      "frequency": "daily | weekdays | weekends",
      "target_days": [0,1,2,3,4,5,6],
      "time": "07:00 AM"
    }
  ]
}
`
}