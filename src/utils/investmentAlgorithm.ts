
// Investment Algorithm Utility

// Step 1: Input Collection Types
export type IncomeSource = {
  type: 'salary' | 'business' | 'rental' | 'capital_gains' | 'dividends' | 'other';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'irregular';
  stability: number; // 0-10 scale, 10 being most stable
};

export type RiskTolerance = 'low' | 'medium' | 'high';

export type FinancialGoal = {
  type: 'short_term' | 'mid_term' | 'long_term';
  targetAmount: number;
  timeframe: number; // in years
  priority: number; // 1-10 scale, 10 being highest priority
};

export type LiquidityPreference = 'immediate' | 'flexible' | 'locked';

export type InvestmentExperience = 'beginner' | 'intermediate' | 'expert';

export type MarketTrend = {
  stockPerformance: number; // -10 to 10 scale
  cryptoVolatility: number; // 0-10 scale
  bondYields: number; // percentage
  inflationRate: number; // percentage
};

export type InvestorProfile = {
  incomeSources: IncomeSource[];
  riskTolerance: RiskTolerance;
  financialGoals: FinancialGoal[];
  liquidityPreference: LiquidityPreference;
  investmentExperience: InvestmentExperience;
  currentMarketTrends?: MarketTrend;
};

// Step 2: Income Pattern & Stability Analysis
export const calculateIncomeStabilityIndex = (incomeSources: IncomeSource[]): number => {
  if (incomeSources.length === 0) return 0;

  // Calculate average income
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const avgIncome = totalIncome / incomeSources.length;

  // Calculate sum of absolute deviations
  const sumDeviations = incomeSources.reduce(
    (sum, source) => sum + Math.abs(source.amount - avgIncome),
    0
  );

  // Calculate ISI (lower is more stable)
  const isi = sumDeviations / incomeSources.length;
  
  // Normalize to a 0-10 scale (10 being most stable)
  const normalizedISI = Math.max(0, 10 - (isi / avgIncome) * 10);
  
  return parseFloat(normalizedISI.toFixed(2));
};

export const categorizeIncomeType = (incomeSources: IncomeSource[]): {
  fixed: number;
  variable: number;
  passive: number;
} => {
  let fixed = 0;
  let variable = 0;
  let passive = 0;
  
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  
  if (totalIncome === 0) return { fixed: 0, variable: 0, passive: 0 };
  
  incomeSources.forEach(source => {
    if (source.type === 'salary' || source.stability >= 8) {
      fixed += source.amount;
    } else if (source.type === 'rental' || source.type === 'dividends') {
      passive += source.amount;
    } else {
      variable += source.amount;
    }
  });
  
  // Convert to percentages
  return {
    fixed: parseFloat(((fixed / totalIncome) * 100).toFixed(2)),
    variable: parseFloat(((variable / totalIncome) * 100).toFixed(2)),
    passive: parseFloat(((passive / totalIncome) * 100).toFixed(2)),
  };
};

// Step 3: Risk-Based Asset Allocation
export const calculateDynamicRiskScore = (
  isi: number,
  marketVolatility: number,
  riskTolerance: RiskTolerance,
  investmentExperience: InvestmentExperience
): number => {
  // Weight factors
  const w1 = 0.3; // ISI weight
  const w2 = 0.2; // Market volatility weight
  const w3 = 0.3; // Risk appetite weight
  const w4 = 0.2; // Investment experience weight
  
  // Convert risk tolerance to numeric value
  let riskAppetite = 0;
  switch (riskTolerance) {
    case 'low': riskAppetite = 2; break;
    case 'medium': riskAppetite = 5; break;
    case 'high': riskAppetite = 8; break;
  }
  
  // Convert investment experience to numeric value
  let expFactor = 0;
  switch (investmentExperience) {
    case 'beginner': expFactor = 3; break;
    case 'intermediate': expFactor = 6; break;
    case 'expert': expFactor = 9; break;
  }
  
  // ISI is already normalized to 0-10, where higher means more stable
  // For DRS calculation, we invert it as lower stability should increase risk score
  const invertedISI = 10 - isi;
  
  // Calculate DRS (0-10 scale)
  const drs = (w1 * invertedISI) + (w2 * marketVolatility) + (w3 * riskAppetite) + (w4 * expFactor);
  
  // Normalize to 0-10
  return parseFloat((drs / 10).toFixed(2));
};

export const getAssetAllocation = (drs: number): {
  [key: string]: number;  // Percentage allocation
} => {
  if (drs <= 3) {
    // Conservative allocation
    return {
      'Fixed Deposits': 30,
      'Government Bonds': 25,
      'Corporate Bonds': 15,
      'Blue-chip Stocks': 20,
      'Mutual Funds': 10,
      'Gold': 0,
      'ETFs': 0,
      'Real Estate': 0,
      'Crypto': 0,
      'Small-cap Stocks': 0,
      'Startups': 0
    };
  } else if (drs <= 7) {
    // Moderate allocation
    return {
      'Fixed Deposits': 15,
      'Government Bonds': 10,
      'Corporate Bonds': 10,
      'Blue-chip Stocks': 25,
      'Mutual Funds': 15,
      'Gold': 5,
      'ETFs': 10,
      'Real Estate': 10,
      'Crypto': 0,
      'Small-cap Stocks': 0,
      'Startups': 0
    };
  } else {
    // Aggressive allocation
    return {
      'Fixed Deposits': 5,
      'Government Bonds': 5,
      'Corporate Bonds': 5,
      'Blue-chip Stocks': 20,
      'Mutual Funds': 10,
      'Gold': 5,
      'ETFs': 15,
      'Real Estate': 15,
      'Crypto': 10,
      'Small-cap Stocks': 5,
      'Startups': 5
    };
  }
};

// Step 4: Investment Selection based on Market
export const getInvestmentRecommendations = (
  assetAllocation: { [key: string]: number },
  marketTrends: MarketTrend,
  totalInvestmentAmount: number
): { 
  assetClass: string; 
  allocation: number; 
  amount: number;
  specific: string[];
} [] => {
  const recommendations = Object.entries(assetAllocation)
    .filter(([_, percentage]) => percentage > 0)
    .map(([assetClass, percentage]) => {
      const amount = (percentage / 100) * totalInvestmentAmount;
      let specific: string[] = [];
      
      // Generate specific investment recommendations based on asset class and market trends
      switch (assetClass) {
        case 'Fixed Deposits':
          specific = ['SBI Fixed Deposit (5.5% p.a.)', 'HDFC Bank Fixed Deposit (5.75% p.a.)'];
          break;
        case 'Government Bonds':
          specific = ['10-year G-Sec Bonds', '5-year Treasury Bonds'];
          break;
        case 'Corporate Bonds':
          specific = ['HDFC Corporate Bond Fund', 'SBI Corporate Bond Fund'];
          break;
        case 'Blue-chip Stocks':
          if (marketTrends.stockPerformance > 5) {
            specific = ['HDFC Bank', 'Reliance Industries', 'TCS', 'Infosys'];
          } else {
            specific = ['ITC', 'HUL', 'Nestle India', 'Asian Paints'];
          }
          break;
        case 'Mutual Funds':
          specific = ['SBI Blue Chip Fund', 'Axis Long Term Equity Fund', 'HDFC Mid-Cap Opportunities Fund'];
          break;
        case 'Gold':
          specific = ['Sovereign Gold Bond', 'Gold ETFs'];
          break;
        case 'ETFs':
          specific = ['Nifty 50 ETF', 'Nifty Next 50 ETF'];
          break;
        case 'Real Estate':
          specific = ['Embassy REIT', 'Mindspace REIT'];
          break;
        case 'Crypto':
          if (marketTrends.cryptoVolatility < 5) {
            specific = ['Bitcoin (BTC)', 'Ethereum (ETH)'];
          } else {
            specific = ['Stablecoins (USDT, USDC)'];
          }
          break;
        case 'Small-cap Stocks':
          specific = ['Selected Small-cap Mutual Funds', 'Direct Small-cap Stocks'];
          break;
        case 'Startups':
          specific = ['Angel Investing Platforms', 'Startup Equity Crowdfunding'];
          break;
        default:
          specific = ['Diversified Funds'];
      }
      
      return {
        assetClass,
        allocation: percentage,
        amount: parseFloat(amount.toFixed(2)),
        specific
      };
    });
    
  return recommendations;
};

// Step 5: Portfolio adjustment and tax optimization suggestions
export const getTaxOptimizationSuggestions = (
  income: number,
  riskTolerance: RiskTolerance
): string[] => {
  const suggestions = [
    'ELSS (Equity Linked Savings Scheme) - Tax saving mutual funds with 3-year lock-in',
    'PPF (Public Provident Fund) - Long-term savings with tax benefits'
  ];
  
  if (income > 1000000) { // High income
    suggestions.push('NPS (National Pension System) - Additional tax benefits under 80CCD(1B)');
    suggestions.push('Tax-free bonds - Long-term infrastructure bonds with tax-free interest');
  }
  
  if (riskTolerance === 'high') {
    suggestions.push('LTCG from stocks/equity (Tax rate of 10% above ₹1 lakh)');
  } else {
    suggestions.push('FDs with senior citizen benefits (Higher interest rates & tax benefits for seniors)');
  }
  
  return suggestions;
};

// Complete investment strategy generation
export const generateInvestmentStrategy = (
  profile: InvestorProfile,
  totalIncome: number,
  investmentAmount: number
): {
  isi: number;
  incomeCategories: { fixed: number; variable: number; passive: number };
  riskScore: number;
  assetAllocation: { [key: string]: number };
  specificRecommendations: { assetClass: string; allocation: number; amount: number; specific: string[] }[];
  taxSuggestions: string[];
} => {
  // Default market trends if not provided
  const marketTrends = profile.currentMarketTrends || {
    stockPerformance: 5,
    cryptoVolatility: 5,
    bondYields: 7,
    inflationRate: 6
  };
  
  // Step 2: Calculate Income Stability
  const isi = calculateIncomeStabilityIndex(profile.incomeSources);
  const incomeCategories = categorizeIncomeType(profile.incomeSources);
  
  // Step 3: Calculate Risk Score and Asset Allocation
  const riskScore = calculateDynamicRiskScore(
    isi,
    marketTrends.cryptoVolatility, // Using crypto volatility as market volatility indicator
    profile.riskTolerance,
    profile.investmentExperience
  );
  
  const assetAllocation = getAssetAllocation(riskScore);
  
  // Step 4: Get Specific Investment Recommendations
  const specificRecommendations = getInvestmentRecommendations(
    assetAllocation,
    marketTrends,
    investmentAmount
  );
  
  // Step 5: Get Tax Optimization Suggestions
  const taxSuggestions = getTaxOptimizationSuggestions(totalIncome, profile.riskTolerance);
  
  return {
    isi,
    incomeCategories,
    riskScore,
    assetAllocation,
    specificRecommendations,
    taxSuggestions
  };
};
