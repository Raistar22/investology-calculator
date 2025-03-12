
import { useState, useEffect } from 'react';
import { InvestmentOption } from '../InvestmentRecommendations';

interface RetirementProjection {
  housing: {
    type: string;
    location: string;
    description: string;
  };
  travel: {
    frequency: string;
    destinations: string[];
    description: string;
  };
  healthcare: {
    coverage: string;
    quality: string;
    description: string;
  };
  lifestyle: {
    type: string;
    activities: string[];
    description: string;
  };
  monthlyIncome: number;
  annualIncome: number;
}

interface RetirementCalculationProps {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
}

export const useRetirementCalculations = ({
  currentAge,
  retirementAge,
  currentIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
}: RetirementCalculationProps) => {
  const [projection, setProjection] = useState<RetirementProjection | null>(null);
  const [savingProgress, setSavingProgress] = useState<number>(0);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  
  // Calculate retirement projections based on income and investments
  useEffect(() => {
    if (currentIncome <= 0) return;
    
    // Years until retirement
    const yearsToRetirement = retirementAge - currentAge;
    
    // Set time progress
    setTimeProgress(Math.min(Math.max((currentAge / retirementAge) * 100, 0), 100));
    
    // Investment calculations
    const monthlyInvestment = recommendedMonthlyInvestment;
    const expectedReturnRate = selectedInvestment ? selectedInvestment.expectedReturn / 100 : 0.08;
    
    // Calculate future value using compound interest formula
    // FV = P(1 + r)^n + PMT × [(1 + r)^n - 1] / r
    const annualInvestment = monthlyInvestment * 12;
    const futureValue = annualInvestment * ((Math.pow(1 + expectedReturnRate, yearsToRetirement) - 1) / expectedReturnRate);
    
    // Assuming a 4% withdrawal rate in retirement (common rule of thumb)
    const estimatedAnnualRetirementIncome = futureValue * 0.04;
    const estimatedMonthlyRetirementIncome = estimatedAnnualRetirementIncome / 12;
    
    // Calculate saving progress (how much of recommended saving they're doing)
    // We're using a default 70% as a placeholder since we don't have actual user savings data
    setSavingProgress(70);
    
    // Determine lifestyle tiers based on monthly retirement income
    let housing, travel, healthcare, lifestyle;
    
    if (estimatedMonthlyRetirementIncome < 30000) {
      housing = {
        type: "1-BHK Apartment",
        location: "Tier-2 City",
        description: "A comfortable apartment in a tier-2 city like Pune or Jaipur."
      };
      travel = {
        frequency: "Occasional",
        destinations: ["Domestic destinations", "Budget trips"],
        description: "Domestic travel once a year to popular tourist destinations."
      };
      healthcare = {
        coverage: "Basic",
        quality: "Government/Affordable Private",
        description: "Basic health insurance with access to standard medical care."
      };
      lifestyle = {
        type: "Modest",
        activities: ["Local entertainment", "Public transport"],
        description: "A comfortable lifestyle with occasional dining out and local activities."
      };
    } else if (estimatedMonthlyRetirementIncome < 80000) {
      housing = {
        type: "2-BHK Apartment",
        location: "Major City Suburbs",
        description: "A spacious apartment in suburbs of cities like Bangalore or Mumbai."
      };
      travel = {
        frequency: "Regular",
        destinations: ["Domestic luxury", "Occasional international"],
        description: "Annual international trip and regular domestic getaways."
      };
      healthcare = {
        coverage: "Comprehensive",
        quality: "Private Hospitals",
        description: "Good health insurance with access to quality private hospitals."
      };
      lifestyle = {
        type: "Comfortable",
        activities: ["Regular dining out", "Entertainment", "Own vehicle"],
        description: "A lifestyle that includes regular social activities and entertainment."
      };
    } else {
      housing = {
        type: "Villa or Premium Apartment",
        location: "Prime Locations",
        description: "A premium property in Goa, Mumbai, or other prime locations."
      };
      travel = {
        frequency: "Frequent",
        destinations: ["International luxury", "Multiple annual trips"],
        description: "Multiple international trips per year including luxury destinations."
      };
      healthcare = {
        coverage: "Premium",
        quality: "Best Private Hospitals",
        description: "Top-tier health coverage with access to the best healthcare facilities."
      };
      lifestyle = {
        type: "Luxury",
        activities: ["Clubs", "Fine dining", "Luxury experiences"],
        description: "A luxurious lifestyle with premium experiences and activities."
      };
    }
    
    setProjection({
      housing,
      travel,
      healthcare,
      lifestyle,
      monthlyIncome: Math.round(estimatedMonthlyRetirementIncome),
      annualIncome: Math.round(estimatedAnnualRetirementIncome)
    });
    
  }, [currentIncome, currentAge, retirementAge, selectedInvestment, recommendedMonthlyInvestment]);

  return {
    projection,
    savingProgress,
    timeProgress
  };
};
