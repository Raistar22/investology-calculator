
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RetirementProgressCards from './RetirementProgressCards';
import IncomeProjectionCard from './IncomeProjectionCard';
import LifestyleCards from './LifestyleCards';
import useRetirementCalculations from './useRetirementCalculations';

// Define the types for lifestyle categories
export interface LifestyleCategory {
  type: string;
  [key: string]: any;
  description: string;
}

interface RetirementDashboardProps {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  lifeExpectancy: number;
}

const RetirementDashboard: React.FC<RetirementDashboardProps> = ({
  currentAge,
  retirementAge,
  currentSavings,
  monthlyContribution,
  expectedReturnRate,
  inflationRate,
  lifeExpectancy,
}) => {
  const {
    yearsToRetirement,
    retirementCorpus,
    monthlyIncomeFromCorpus,
    annualIncomeFromCorpus,
    percentageToGoal,
    savingsRate,
  } = useRetirementCalculations({
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    expectedReturnRate,
    inflationRate,
    lifeExpectancy,
  });

  // Define lifestyle categories with their types
  const lifestyleCategories: LifestyleCategory[] = [
    {
      type: "housing",
      tier: monthlyIncomeFromCorpus > 100000 ? "luxury" : monthlyIncomeFromCorpus > 50000 ? "comfortable" : "modest",
      location: monthlyIncomeFromCorpus > 80000 ? "premium city center" : monthlyIncomeFromCorpus > 40000 ? "good neighborhood" : "suburb",
      description: monthlyIncomeFromCorpus > 100000 
        ? "Luxury apartment in a premium location" 
        : monthlyIncomeFromCorpus > 50000 
        ? "Comfortable housing in a good neighborhood" 
        : "Modest accommodation in an affordable area"
    },
    {
      type: "travel",
      frequency: monthlyIncomeFromCorpus > 100000 ? "frequent" : monthlyIncomeFromCorpus > 50000 ? "occasional" : "rare",
      destinations: monthlyIncomeFromCorpus > 100000 ? ["International luxury", "First class"] : monthlyIncomeFromCorpus > 50000 ? ["Domestic premium", "International budget"] : ["Local getaways"],
      description: monthlyIncomeFromCorpus > 100000 
        ? "Frequent international travel with luxury accommodations" 
        : monthlyIncomeFromCorpus > 50000 
        ? "Occasional international and regular domestic trips" 
        : "Budget-friendly local vacations"
    },
    {
      type: "healthcare",
      coverage: monthlyIncomeFromCorpus > 80000 ? "comprehensive" : monthlyIncomeFromCorpus > 40000 ? "standard" : "basic",
      quality: monthlyIncomeFromCorpus > 80000 ? "premium" : monthlyIncomeFromCorpus > 40000 ? "good" : "adequate",
      description: monthlyIncomeFromCorpus > 80000 
        ? "Access to premium healthcare with comprehensive coverage" 
        : monthlyIncomeFromCorpus > 40000 
        ? "Good quality healthcare with standard coverage" 
        : "Adequate healthcare with basic coverage"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Retirement Lifestyle Dashboard</h2>
      
      <RetirementProgressCards 
        yearsToRetirement={yearsToRetirement}
        percentageToGoal={percentageToGoal}
        retirementCorpus={retirementCorpus}
        savingsRate={savingsRate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IncomeProjectionCard 
          monthlyIncome={monthlyIncomeFromCorpus}
          annualIncome={annualIncomeFromCorpus}
        />
        
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
      
      <LifestyleCards lifestyleCategories={lifestyleCategories} />
    </div>
  );
};

export default RetirementDashboard;
