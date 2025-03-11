
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TaxRegimeSelectorProps {
  onSelect: (regime: 'old' | 'new') => void;
  selectedRegime: 'old' | 'new' | null;
}

const regimeData = {
  old: {
    title: "Old Tax Regime",
    description: "Higher tax rates with various deductions and exemptions.",
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
    benefits: [
      "Simplified tax structure with lower rates",
      "No need to make specific investments for tax saving",
      "Beneficial for those with fewer deductions",
      "Standard deduction of ₹50,000 available"
    ]
  }
};

const TaxRegimeSelector: React.FC<TaxRegimeSelectorProps> = ({ onSelect, selectedRegime }) => {
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
        {(Object.keys(regimeData) as Array<keyof typeof regimeData>).map((regime) => (
          <div
            key={regime}
            className={cn(
              "relative rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer",
              selectedRegime === regime 
                ? "border-primary shadow-sm bg-primary/5" 
                : "border-border hover:border-primary/40"
            )}
            onClick={() => onSelect(regime)}
          >
            {selectedRegime === regime && (
              <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            <h4 className="text-lg font-medium mb-2">{regimeData[regime].title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{regimeData[regime].description}</p>
            
            <div className="space-y-2">
              {regimeData[regime].benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxRegimeSelector;
