
import React from 'react';
import { Button } from '@/components/ui/button';
import { InvestmentOption } from '../InvestmentRecommendations';
import { useRetirementCalculations } from './useRetirementCalculations';
import IncomeProjectionCard from './IncomeProjectionCard';
import RetirementProgressCards from './RetirementProgressCards';
import LifestyleCards from './LifestyleCards';

interface RetirementDashboardProps {
  currentAge?: number;
  retirementAge?: number;
  currentIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
}

const RetirementDashboard: React.FC<RetirementDashboardProps> = ({
  currentAge = 30,
  retirementAge = 60,
  currentIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
}) => {
  const { projection, savingProgress, timeProgress } = useRetirementCalculations({
    currentAge,
    retirementAge,
    currentIncome,
    selectedInvestment,
    recommendedMonthlyInvestment,
  });

  if (!projection) {
    return (
      <div className="rounded-xl p-6 glass text-center">
        <h3 className="text-xl font-semibold">Retirement Lifestyle Projection</h3>
        <p className="text-muted-foreground mt-2">
          Add income sources and select an investment strategy to see your retirement lifestyle projection.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 glass">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Retirement Lifestyle Projection</h3>
        <p className="text-muted-foreground mt-1">
          Based on your current inputs, here's what your retirement could look like at age {retirementAge}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <IncomeProjectionCard 
          monthlyIncome={projection.monthlyIncome}
          annualIncome={projection.annualIncome}
        />
        
        <RetirementProgressCards
          timeProgress={timeProgress}
          savingProgress={savingProgress}
          retirementAge={retirementAge}
          currentAge={currentAge}
          recommendedMonthlyInvestment={recommendedMonthlyInvestment}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LifestyleCards
          housing={projection.housing}
          travel={projection.travel}
          healthcare={projection.healthcare}
          lifestyle={projection.lifestyle}
        />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          These projections are based on your current financial information and market assumptions. Actual results may vary.
        </p>
        <Button variant="outline" size="sm">
          Adjust Retirement Goals
        </Button>
      </div>
    </div>
  );
};

export default RetirementDashboard;
