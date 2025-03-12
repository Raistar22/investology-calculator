
import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaxRegimeSelector from '@/components/calculator/TaxRegimeSelector';
import IncomeSourcesForm, { IncomeSource } from '@/components/calculator/IncomeSourcesForm';
import InvestmentRecommendations, { InvestmentOption } from '@/components/calculator/InvestmentRecommendations';
import ReturnCalculator from '@/components/calculator/ReturnCalculator';
import StockMarketData from '@/components/calculator/StockMarketData';
import RetirementDashboard from '@/components/calculator/RetirementDashboard';
import PensionWithdrawalPlanner from '@/components/calculator/PensionWithdrawalPlanner';
import { toast } from 'sonner';

const Calculator = () => {
  const [selectedRegime, setSelectedRegime] = useState<'old' | 'new' | null>(null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOption | null>(null);
  
  useEffect(() => {
    const total = incomeSources.reduce((sum, source) => sum + (source.amount || 0), 0);
    setTotalIncome(total);
  }, [incomeSources]);
  
  const handleRegimeSelect = (regime: 'old' | 'new') => {
    setSelectedRegime(regime);
    toast.success(`${regime.charAt(0).toUpperCase() + regime.slice(1)} Tax Regime selected`);
  };
  
  const handleIncomeUpdate = (sources: IncomeSource[]) => {
    setIncomeSources(sources);
  };
  
  const handleInvestmentSelect = (option: InvestmentOption) => {
    setSelectedInvestment(option);
    toast.success(`${option.name} selected as investment choice`);
  };
  
  // Calculate recommended monthly investment (30% of annual income divided by 12)
  const recommendedMonthlyInvestment = Math.round((totalIncome * 0.3) / 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 text-primary rounded-full mb-4">
              <CalculatorIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Tax & Investment Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Optimize your tax regime, analyze your income sources, and discover personalized investment strategies.
            </p>
          </div>
          
          <div className="space-y-8">
            <TaxRegimeSelector
              onSelect={handleRegimeSelect}
              selectedRegime={selectedRegime}
            />
            
            <IncomeSourcesForm onUpdate={handleIncomeUpdate} />
            
            {totalIncome > 0 && (
              <InvestmentRecommendations
                incomeTotal={totalIncome}
                onSelect={handleInvestmentSelect}
                selectedOption={selectedInvestment}
              />
            )}
            
            <ReturnCalculator
              selectedInvestment={selectedInvestment}
              recommendedMonthly={recommendedMonthlyInvestment}
            />
            
            {/* New Pension Withdrawal Planner Component */}
            {totalIncome > 0 && (
              <PensionWithdrawalPlanner
                currentIncome={totalIncome}
                pensionCorpus={totalIncome * 10}
              />
            )}
            
            {/* Retirement Dashboard Component */}
            {totalIncome > 0 && (
              <RetirementDashboard
                currentIncome={totalIncome}
                selectedInvestment={selectedInvestment}
                recommendedMonthlyInvestment={recommendedMonthlyInvestment}
              />
            )}
            
            {/* Stock Market Data Component */}
            <StockMarketData />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calculator;
