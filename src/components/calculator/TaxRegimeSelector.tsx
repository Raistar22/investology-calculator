
import React from 'react';
import { Info, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaxRegimeSelectorProps {
  onSelect: (regime: 'old' | 'new') => void;
  selectedRegime: 'old' | 'new' | null;
}

// Real tax rate data for both regimes
export const taxRates = {
  old: {
    title: "Old Tax Regime",
    description: "Higher tax rates with various deductions and exemptions.",
    rates: [
      { income: 250000, rate: 0, maxTax: 0 },
      { income: 500000, rate: 5, maxTax: 12500 },
      { income: 1000000, rate: 20, maxTax: 112500 },
      { income: Infinity, rate: 30, maxTax: null }
    ],
    deductions: {
      "80C": 150000,
      "80D": 25000,
      "HRA": "Actual or 40-50% of basic salary",
      "Standard": 50000
    },
    benefits: [
      "Allows Section 80C deductions up to ₹1.5 lakh",
      "Includes HRA, LTA, and standard deduction benefits",
      "Beneficial for those with multiple investments",
      "Allows home loan interest deductions"
    ]
  },
  new: {
    title: "New Tax Regime",
    description: "Lower tax rates without most deductions and exemptions.",
    rates: [
      { income: 300000, rate: 0, maxTax: 0 },
      { income: 600000, rate: 5, maxTax: 15000 },
      { income: 900000, rate: 10, maxTax: 45000 },
      { income: 1200000, rate: 15, maxTax: 90000 },
      { income: 1500000, rate: 20, maxTax: 150000 },
      { income: Infinity, rate: 30, maxTax: null }
    ],
    deductions: {
      "Standard": 50000
    },
    benefits: [
      "Simplified tax structure with lower rates",
      "No need to make specific investments for tax saving",
      "Beneficial for those with fewer deductions",
      "Standard deduction of ₹50,000 available"
    ]
  }
};

// Function to calculate tax based on regime and income
export const calculateTax = (regime: 'old' | 'new', income: number): number => {
  const slabs = taxRates[regime].rates;
  let tax = 0;
  let remainingIncome = income;
  
  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const prevThreshold = i > 0 ? slabs[i-1].income : 0;
    const slabIncome = Math.min(remainingIncome, slab.income - prevThreshold);
    
    if (slabIncome <= 0) break;
    
    tax += (slabIncome * slab.rate) / 100;
    remainingIncome -= slabIncome;
    
    if (remainingIncome <= 0) break;
  }
  
  return Math.round(tax);
};

export const getRecommendedRegime = (income: number, deductionsAmount: number): 'old' | 'new' => {
  // Calculate taxes under both regimes
  const oldTax = calculateTax('old', Math.max(0, income - deductionsAmount));
  const newTax = calculateTax('new', income);
  
  // Return recommended regime based on lowest tax
  return oldTax <= newTax ? 'old' : 'new';
};

const TaxRegimeSelector: React.FC<TaxRegimeSelectorProps> = ({ onSelect, selectedRegime }) => {
  const handleSelect = (regime: 'old' | 'new') => {
    onSelect(regime);
    toast.success(`${regime === 'old' ? 'Old' : 'New'} Tax Regime selected`, {
      description: `You've selected the ${regime === 'old' ? 'Old' : 'New'} Tax Regime. Your calculations will now be based on this selection.`
    });
  };

  return (
    <div className="rounded-xl p-6 glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Select Tax Regime</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Your tax regime choice affects tax rates and eligible deductions. Select the option that minimizes your tax liability.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(taxRates) as Array<keyof typeof taxRates>).map((regime) => (
          <div
            key={regime}
            className={cn(
              "relative rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer",
              selectedRegime === regime 
                ? "border-primary shadow-sm bg-primary/5" 
                : "border-border hover:border-primary/40"
            )}
            onClick={() => handleSelect(regime)}
          >
            {selectedRegime === regime && (
              <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            <h4 className="text-lg font-medium mb-2">{taxRates[regime].title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{taxRates[regime].description}</p>
            
            <div className="space-y-2">
              {taxRates[regime].benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            {regime === 'old' && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center text-xs text-amber-600 font-medium">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Max 80C deduction: ₹{taxRates.old.deductions["80C"].toLocaleString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxRegimeSelector;
