
import React from 'react';
import { ArrowRight, TrendingUp, Shield, Building, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface InvestmentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedReturn: number;
  allocation: number;
  timeHorizon: string;
}

interface InvestmentRecommendationsProps {
  incomeTotal: number;
  onSelect: (option: InvestmentOption) => void;
  selectedOption: InvestmentOption | null;
}

const InvestmentRecommendations: React.FC<InvestmentRecommendationsProps> = ({
  incomeTotal,
  onSelect,
  selectedOption
}) => {
  // Sample investment options
  const investmentOptions: InvestmentOption[] = [
    {
      id: 'stocks',
      name: 'Equity Stocks',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'High growth potential with higher volatility, suitable for long-term goals.',
      riskLevel: 'High',
      expectedReturn: 12,
      allocation: 40,
      timeHorizon: '5+ years'
    },
    {
      id: 'bonds',
      name: 'Debt Securities',
      icon: <Shield className="h-5 w-5" />,
      description: 'Steady returns with lower risk, ideal for capital preservation.',
      riskLevel: 'Low',
      expectedReturn: 7,
      allocation: 25,
      timeHorizon: '2-4 years'
    },
    {
      id: 'real_estate',
      name: 'Real Estate',
      icon: <Building className="h-5 w-5" />,
      description: 'Tangible assets with rental income potential and capital appreciation.',
      riskLevel: 'Medium',
      expectedReturn: 9,
      allocation: 20,
      timeHorizon: '7+ years'
    },
    {
      id: 'gold',
      name: 'Gold & Precious Metals',
      icon: <Coins className="h-5 w-5" />,
      description: 'Hedge against inflation and economic uncertainty with moderate returns.',
      riskLevel: 'Medium',
      expectedReturn: 8,
      allocation: 15,
      timeHorizon: '3-5 years'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-amber-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Calculate recommended monthly investment amount (30% of annual income divided by 12)
  const recommendedMonthlyInvestment = Math.round((incomeTotal * 0.3) / 12);

  return (
    <div className="rounded-xl p-6 glass">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Investment Recommendations</h3>
        <p className="text-muted-foreground mt-1">
          Based on your income profile of ₹{incomeTotal.toLocaleString('en-IN')} annually
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm font-medium">Recommended Monthly Investment</p>
            <p className="text-2xl font-bold">₹{recommendedMonthlyInvestment.toLocaleString('en-IN')}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 w-full md:w-auto">
            {investmentOptions.map((option) => (
              <div key={option.id} className="flex flex-col items-center">
                <div 
                  className="h-3 w-full rounded-full" 
                  style={{ backgroundColor: `rgba(var(--primary), ${option.allocation / 100})` }}
                />
                <p className="text-xs mt-1">{option.allocation}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investmentOptions.map((option) => (
          <div 
            key={option.id}
            className={cn(
              "rounded-lg p-4 border-2 transition-all duration-300 cursor-pointer",
              selectedOption?.id === option.id 
                ? "border-primary shadow-sm bg-primary/5" 
                : "border-border hover:border-primary/40"
            )}
            onClick={() => onSelect(option)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {option.icon}
              </div>
              <div>
                <h4 className="font-medium">{option.name}</h4>
                <div className="flex items-center mt-1">
                  <div className={`h-2 w-2 rounded-full ${getRiskColor(option.riskLevel)} mr-1.5`} />
                  <span className="text-xs text-muted-foreground">{option.riskLevel} Risk</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {option.description}
            </p>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Expected Return</span>
                <span className="font-medium">{option.expectedReturn}%</span>
              </div>
              <Progress value={option.expectedReturn * 5} className="h-1.5" />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Time Horizon: {option.timeHorizon}</span>
              <span className="text-primary font-medium">
                {option.allocation}% Allocation
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentRecommendations;
