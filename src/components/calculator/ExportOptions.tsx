import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FilePdf as FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/utils/exportData';
import { InvestmentOption } from './InvestmentRecommendations';
import { IncomeSource } from './IncomeSourcesForm';
import { toast } from 'sonner';

interface ExportOptionsProps {
  taxRegime: 'old' | 'new' | null;
  incomeSources: IncomeSource[];
  totalIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
  timeHorizon: number;
  finalValue: number;
  totalInvested: number;
  totalReturns: number;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  taxRegime,
  incomeSources,
  totalIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
  timeHorizon,
  finalValue,
  totalInvested,
  totalReturns
}) => {
  const exportData = {
    taxRegime,
    incomeSources,
    totalIncome,
    selectedInvestment,
    recommendedMonthlyInvestment,
    timeHorizon,
    projectedFinalValue: finalValue,
    totalInvested,
    totalReturns,
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(exportData);
      toast.success('Investment data exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel. Please try again.');
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF('investment-summary', 'Investment_Plan.pdf');
      toast.success('Investment data exported to PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export to PDF. Please try again.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={handleExportExcel}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export to Excel
      </Button>
      <Button 
        variant="default" 
        className="gap-2"
        onClick={handleExportPDF}
      >
        <FileText className="h-4 w-4" />
        Export to PDF
      </Button>
    </div>
  );
};

export default ExportOptions;
