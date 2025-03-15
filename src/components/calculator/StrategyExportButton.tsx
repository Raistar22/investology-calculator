
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { exportToExcel } from '@/utils/exportData';
import { InvestmentOption } from './InvestmentRecommendations';
import { IncomeSource } from './IncomeSourcesForm';
import { toast } from 'sonner';

interface StrategyExportButtonProps {
  taxRegime: 'old' | 'new' | null;
  incomeSources: IncomeSource[];
  totalIncome: number;
  selectedInvestment: InvestmentOption;
  recommendedMonthlyInvestment: number;
  timeHorizon: number;
}

const StrategyExportButton: React.FC<StrategyExportButtonProps> = ({
  taxRegime,
  incomeSources,
  totalIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
  timeHorizon,
}) => {
  const handleExportStrategy = () => {
    try {
      // Calculate some projected values for the export
      const monthlyReturn = selectedInvestment.expectedReturn / 100 / 12;
      const totalMonths = timeHorizon * 12;
      const projectedFinalValue = recommendedMonthlyInvestment * 
        ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * 
        (1 + monthlyReturn);
      const totalInvested = recommendedMonthlyInvestment * totalMonths;
      const totalReturns = projectedFinalValue - totalInvested;
      
      const exportData = {
        taxRegime,
        incomeSources,
        totalIncome,
        selectedInvestment,
        recommendedMonthlyInvestment,
        timeHorizon,
        projectedFinalValue,
        totalInvested,
        totalReturns,
        strategyDetails: {
          name: selectedInvestment.name,
          description: selectedInvestment.description,
          expectedReturn: selectedInvestment.expectedReturn,
          riskLevel: selectedInvestment.riskLevel,
          allocation: selectedInvestment.allocation,
        }
      };
      
      exportToExcel(exportData);
      toast.success(`${selectedInvestment.name} strategy exported to Excel successfully`);
    } catch (error) {
      console.error('Error exporting strategy to Excel:', error);
      toast.error('Failed to export strategy. Please try again.');
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 gap-1"
          onClick={handleExportStrategy}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Export
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="font-medium">Export {selectedInvestment.name}</h4>
          <p className="text-sm text-muted-foreground">
            Download a detailed Excel report of this investment strategy including allocation breakdown and projected returns.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default StrategyExportButton;
