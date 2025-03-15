
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvestmentOption } from '@/components/calculator/InvestmentRecommendations';
import { IncomeSource } from '@/components/calculator/IncomeSourcesForm';

interface ExportData {
  taxRegime: 'old' | 'new' | null;
  incomeSources: IncomeSource[];
  totalIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
  timeHorizon: number;
  projectedFinalValue: number;
  totalInvested: number;
  totalReturns: number;
}

export const exportToExcel = (data: ExportData) => {
  const worksheet = XLSX.utils.json_to_sheet([
    {
      'Tax Regime': data.taxRegime ? data.taxRegime.charAt(0).toUpperCase() + data.taxRegime.slice(1) : 'Not Selected',
      'Total Income': `₹${data.totalIncome.toLocaleString('en-IN')}`,
      'Recommended Monthly Investment': `₹${data.recommendedMonthlyInvestment.toLocaleString('en-IN')}`,
      'Investment Plan': data.selectedInvestment?.name || 'Not Selected',
      'Expected Return Rate': data.selectedInvestment ? `${data.selectedInvestment.expectedReturn}%` : 'N/A',
      'Time Horizon (Years)': data.timeHorizon,
      'Projected Final Value': `₹${data.projectedFinalValue.toLocaleString('en-IN')}`,
      'Total Amount Invested': `₹${data.totalInvested.toLocaleString('en-IN')}`,
      'Total Returns': `₹${data.totalReturns.toLocaleString('en-IN')}`,
    }
  ]);

  // Add income sources as separate sheet
  const incomeSourcesSheet = XLSX.utils.json_to_sheet(
    data.incomeSources.map(source => ({
      'Source': source.type,
      'Amount': `₹${source.amount?.toLocaleString('en-IN') || '0'}`,
      'Description': source.description || ''
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Investment Summary');
  XLSX.utils.book_append_sheet(workbook, incomeSourcesSheet, 'Income Sources');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = data.selectedInvestment ? 
    `${data.selectedInvestment.name.replace(/\s+/g, '_')}_Strategy.xlsx` : 
    'Investment_Plan.xlsx';
  saveAs(blob, fileName);
};

export const exportToPDF = async (elementId: string, fileName: string = 'Investment_Plan.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
