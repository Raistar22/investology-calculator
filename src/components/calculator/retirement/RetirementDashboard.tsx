
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RetirementProgressCards from './RetirementProgressCards';
import IncomeProjectionCard from './IncomeProjectionCard';
import LifestyleCards from './LifestyleCards';
import { useRetirementCalculations } from './useRetirementCalculations';
import { InvestmentOption } from '@/components/calculator/InvestmentRecommendations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define the types for lifestyle categories
export interface LifestyleCategory {
  type: string;
  [key: string]: any;
  description: string;
}

interface RetirementDashboardProps {
  retirementAge?: number;
  currentSavings?: number;
  monthlyContribution?: number;
  expectedReturnRate?: number;
  inflationRate?: number;
  lifeExpectancy?: number;
  currentIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
}

const RetirementDashboard: React.FC<RetirementDashboardProps> = ({
  retirementAge = 60,
  currentSavings = 100000,
  monthlyContribution = 10000,
  expectedReturnRate = 8,
  inflationRate = 5,
  lifeExpectancy = 85,
  currentIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
}) => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  
  const {
    projection,
    savingProgress,
    timeProgress
  } = useRetirementCalculations({
    currentAge,
    retirementAge,
    currentIncome,
    selectedInvestment,
    recommendedMonthlyInvestment,
  });

  // Calculate years to retirement
  const yearsToRetirement = retirementAge - currentAge;
  
  // For simplicity, assuming the goal is to have 30 times annual income by retirement
  const retirementGoal = currentIncome * 30;
  const currentProgress = currentSavings + (monthlyContribution * 12 * yearsToRetirement);
  const percentageToGoal = Math.min(Math.round((currentProgress / retirementGoal) * 100), 100);
  
  // Calculate savings rate (percentage of income being saved)
  const savingsRate = Math.round((monthlyContribution * 12 / currentIncome) * 100);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value < retirementAge) {
      setCurrentAge(value);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Retirement Lifestyle Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border border-white/20 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="text-lg">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-age" className="mb-2 block">Current Age</Label>
                <Input 
                  id="current-age" 
                  type="number" 
                  value={currentAge} 
                  onChange={handleAgeChange} 
                  min={18} 
                  max={retirementAge - 1} 
                  placeholder="Enter your current age"
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You have {yearsToRetirement} years until retirement at age {retirementAge}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <RetirementProgressCards 
          timeProgress={timeProgress}
          savingProgress={savingProgress}
          retirementAge={retirementAge}
          currentAge={currentAge}
          recommendedMonthlyInvestment={recommendedMonthlyInvestment}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projection && (
          <IncomeProjectionCard 
            monthlyIncome={projection.monthlyIncome}
            annualIncome={projection.annualIncome}
          />
        )}
        
        <Card className="md:col-span-2 border border-white/20 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="text-lg">Investment Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  {monthlyContribution < 15000 
                    ? "Consider increasing your monthly contributions to achieve a more comfortable retirement."
                    : "Your contribution level is solid. For further growth, diversify your investments."}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  {expectedReturnRate < 8 
                    ? "Your expected return rate is conservative. Consider some growth assets for potential higher returns."
                    : "Your expected return rate is optimistic. Ensure your portfolio is balanced with some safer assets."}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  {inflationRate > 6 
                    ? "Your inflation estimate is high. Consider inflation-protected securities in your portfolio."
                    : "Your inflation estimate is reasonable. Continue monitoring economic trends."}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LifestyleCards 
            housing={projection.housing}
            travel={projection.travel}
            healthcare={projection.healthcare}
            lifestyle={projection.lifestyle}
          />
        </div>
      )}
    </div>
  );
};

export default RetirementDashboard;
