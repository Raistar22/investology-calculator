
/**
 * Fetch finance-related info using the Gemini API.
 * Returns a concise response.
 */
export async function fetchGemini(query: string): Promise<string> {
  const apiKey = "AIzaSyDi84WofdRu_bMW1FodHt27JuT45TZARAs";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  // Add website-specific context to enrich responses
  const websiteContext = `
    Tax regimes in India:
    - Old Tax Regime: Higher tax rates with deductions (80C, HRA, etc.)
    - New Tax Regime: Lower tax rates with minimal deductions
    
    Old Regime rates: Up to ₹2.5L: Nil, ₹2.5L-₹5L: 5%, ₹5L-₹10L: 20%, Above ₹10L: 30%
    New Regime rates: Up to ₹3L: Nil, ₹3L-₹6L: 5%, ₹6L-₹9L: 10%, ₹9L-₹12L: 15%, ₹12L-₹15L: 20%, Above ₹15L: 30%
    
    Popular deductions: 80C (up to ₹1.5L), 80D (Health Insurance), HRA, Home Loan Interest
    
    ITR Filing process requires: PAN, Aadhaar, income details, and Form 16
  `;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "You are a helpful and accurate financial assistant specializing in Indian taxation and personal finance. " +
              "Use the following context about tax regimes and financial information when relevant: " +
              websiteContext +
              "When possible, answer with up-to-date, real facts. " +
              "If the question is personal, answer with general advice only. Question: " + query,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 400,
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

// Helper function to get tax regime information from the website data
export function getTaxRegimeInfo(regime: 'old' | 'new'): string {
  const regimeInfo = {
    old: {
      name: "Old Tax Regime",
      description: "Higher tax rates with various deductions and exemptions.",
      rates: [
        { income: 250000, rate: 0 },
        { income: 500000, rate: 5 },
        { income: 1000000, rate: 20 },
        { income: Infinity, rate: 30 }
      ],
      deductions: ["Section 80C (up to ₹1.5 lakh)", "HRA", "Home Loan Interest", "Standard Deduction (₹50,000)"]
    },
    new: {
      name: "New Tax Regime",
      description: "Lower tax rates without most deductions and exemptions.",
      rates: [
        { income: 300000, rate: 0 },
        { income: 600000, rate: 5 },
        { income: 900000, rate: 10 },
        { income: 1200000, rate: 15 },
        { income: 1500000, rate: 20 },
        { income: Infinity, rate: 30 }
      ],
      deductions: ["Standard Deduction (₹50,000)"]
    }
  };

  const info = regimeInfo[regime];
  return `
    ${info.name}: ${info.description}
    
    Tax Slabs:
    ${info.rates.map((rate, index, arr) => {
      if (index === arr.length - 1) {
        return `Above ₹${(arr[index-1].income/100000).toFixed(1)}L: ${rate.rate}%`;
      }
      const from = index === 0 ? 0 : arr[index-1].income;
      return `₹${(from/100000).toFixed(1)}L to ₹${(rate.income/100000).toFixed(1)}L: ${rate.rate}%`;
    }).join('\n    ')}
    
    Available Deductions:
    ${info.deductions.join(', ')}
  `;
}

// Function to search for tax-related information from website data
export function searchWebsiteData(query: string): string | null {
  query = query.toLowerCase();
  
  // Map of keywords to information
  const infoMap: Record<string, string> = {
    "old tax regime": getTaxRegimeInfo('old'),
    "new tax regime": getTaxRegimeInfo('new'),
    "80c": "Section 80C allows deductions up to ₹1.5 lakh per year for investments in PPF, ELSS, LIC premiums, etc.",
    "hra": "House Rent Allowance (HRA) exemption is available for rent paid. The minimum of: 1) Actual HRA received, 2) Rent paid minus 10% of salary, 3) 50% of salary (metro) or 40% of salary (non-metro).",
    "itr filing": "ITR filing requires documents like Form 16, bank statements, investment proofs, and rent receipts. The filing deadline is typically July 31st.",
    "retirement": "Retirement planning options include EPF, PPF, NPS, and various pension schemes. NPS offers additional tax benefits under section 80CCD(1B).",
    "investment": "Investment options include equity (stocks, mutual funds), debt (bonds, FDs), hybrid funds, gold, and real estate. Risk, return, and time horizon should be considered."
  };

  // Search for keywords in the query
  for (const [keyword, info] of Object.entries(infoMap)) {
    if (query.includes(keyword)) {
      return info;
    }
  }

  return null; // No relevant website data found
}
