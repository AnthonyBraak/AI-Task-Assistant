export async function categorizeTaskGroq(task: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ API key");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You categorize tasks into one of the following categories:
               - Work
               - Personal
               - Study
               - Home
               - Health
               - Errands
               - Other

               Return only the category name.`,
          },
          {
            role: "user",
            content: `Categorize this task: "${task}"`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
