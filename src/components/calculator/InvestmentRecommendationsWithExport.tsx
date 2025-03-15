
import React from 'react';
import InvestmentRecommendations, { InvestmentOption } from './InvestmentRecommendations';
import StrategyExportButton from './StrategyExportButton';
import { IncomeSource } from './IncomeSourcesForm';

interface InvestmentRecommendationsWithExportProps {
  incomeTotal: number;
  onSelect: (option: InvestmentOption) => void;
  selectedOption: InvestmentOption | null;
  incomeSources: IncomeSource[];
  taxRegime: 'old' | 'new' | null;
  recommendedMonthlyInvestment: number;
  timeHorizon: number;
}

const InvestmentRecommendationsWithExport: React.FC<InvestmentRecommendationsWithExportProps> = ({
  incomeTotal,
  onSelect,
  selectedOption,
  incomeSources,
  taxRegime,
  recommendedMonthlyInvestment,
  timeHorizon,
}) => {
  // Render the original InvestmentRecommendations
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Investment Recommendations</h2>
        {selectedOption && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              Selected Strategy: <span className="font-medium text-foreground">{selectedOption.name}</span>
            </span>
            <StrategyExportButton
              taxRegime={taxRegime}
              incomeSources={incomeSources}
              totalIncome={incomeTotal}
              selectedInvestment={selectedOption}
              recommendedMonthlyInvestment={recommendedMonthlyInvestment}
              timeHorizon={timeHorizon}
            />
          </div>
        )}
      </div>
      <InvestmentRecommendations
        incomeTotal={incomeTotal}
        onSelect={onSelect}
        selectedOption={selectedOption}
      />
    </div>
  );
};

export default InvestmentRecommendationsWithExport;
