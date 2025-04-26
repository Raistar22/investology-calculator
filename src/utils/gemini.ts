
/**
 * Fetch finance-related info using the Gemini API.
 * Returns a concise response.
 */
export async function fetchGemini(query: string): Promise<string> {
  const apiKey = "AIzaSyDi84WofdRu_bMW1FodHt27JuT45TZARAs";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "You are a helpful and concise financial assistant. When possible, answer with up-to-date, real facts. " +
              "If the question is personal, answer with general advice only. Question: " + query,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 256,
      topP: 0.8,
      topK: 40,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    // Gemini API returns candidates[0].content.parts[0].text as the answer
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I couldn't find an answer for your question."
    );
  } catch (err) {
    console.error("Gemini fetch error:", err);
    throw new Error("Failed to fetch from Gemini.");
  }
}
