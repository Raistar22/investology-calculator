
/**
 * Fetch finance-related info using Perplexity API if API key is set in localStorage.
 * Returns a short answer, throws if failed.
 */
export async function fetchPerplexity(query: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and concise financial assistant. When possible, answer with up-to-date, real facts. If question is personal, answer with general advice only.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });
    // Perplexity's API returns JSON with choices[0].message.content as the reply
    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't find live data for your question."
    );
  } catch (err: any) {
    console.error("Perplexity fetch error:", err);
    throw new Error("Failed to fetch from Perplexity.");
  }
}
