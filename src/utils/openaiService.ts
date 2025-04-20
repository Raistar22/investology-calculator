
import { toast } from 'sonner';
import { InvestorProfile } from './investmentAlgorithm';

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const generateOpenAIInvestmentStrategy = async (
  apiKey: string,
  profile: InvestorProfile,
  totalIncome: number,
  investmentAmount: number
): Promise<any> => {
  try {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is required');
    }

    const prompt = `
      As a financial advisor, provide an investment strategy based on the following profile:
      
      Total Annual Income: ₹${totalIncome}
      Monthly Investment Amount: ₹${investmentAmount / 12}
      
      Income Sources: ${profile.incomeSources.map(source => 
        `${source.type}: ₹${source.amount} (${source.frequency}, stability: ${source.stability}/10)`
      ).join(', ')}
      
      Risk Tolerance: ${profile.riskTolerance}
      Investment Experience: ${profile.investmentExperience}
      Liquidity Preference: ${profile.liquidityPreference}
      
      Financial Goals:
      ${profile.financialGoals.map(goal => 
        `- ${goal.type} goal: ₹${goal.targetAmount} in ${goal.timeframe} years (priority: ${goal.priority}/10)`
      ).join('\n')}
      
      Provide a detailed investment strategy in the following JSON format:
      {
        "isi": number between 0-10,
        "incomeCategories": {
          "fixed": percentage,
          "variable": percentage,
          "passive": percentage
        },
        "riskScore": number between 0-10,
        "assetAllocation": {
          "Fixed Deposits": percentage,
          "Government Bonds": percentage,
          "Corporate Bonds": percentage,
          "Blue-chip Stocks": percentage,
          "Mutual Funds": percentage,
          "Gold": percentage,
          "ETFs": percentage,
          "Real Estate": percentage,
          "Crypto": percentage,
          "Small-cap Stocks": percentage,
          "Startups": percentage
        },
        "specificRecommendations": [
          {
            "assetClass": string,
            "allocation": percentage,
            "amount": number,
            "specific": [array of specific investment options]
          }
        ],
        "taxSuggestions": [array of tax optimization suggestions]
      }
      
      Ensure all percentages add up to 100%, provide realistic specific investment recommendations considering the Indian market, and include appropriate tax savings options based on the income level.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor specializing in Indian investments and tax planning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate investment strategy');
    }

    const data = await response.json() as OpenAIResponse;
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse the AI response');
    }
    
    const strategyJson = JSON.parse(jsonMatch[0]);
    return strategyJson;
  } catch (error) {
    console.error('OpenAI API error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate AI strategy');
    return null;
  }
};
