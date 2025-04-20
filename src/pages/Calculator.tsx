
import React, { useState, useEffect, useRef } from 'react';
import { Calculator as CalculatorIcon, Download, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaxRegimeSelector from '@/components/calculator/TaxRegimeSelector';
import IncomeSourcesForm, { IncomeSource } from '@/components/calculator/IncomeSourcesForm';
import InvestmentRecommendationsWithExport from '@/components/calculator/InvestmentRecommendationsWithExport';
import { InvestmentOption } from '@/components/calculator/InvestmentRecommendations';
import ReturnCalculator from '@/components/calculator/ReturnCalculator';
import StockMarketData from '@/components/calculator/StockMarketData';
import RetirementDashboard from '@/components/calculator/retirement/RetirementDashboard';
import PensionWithdrawalPlanner from '@/components/calculator/PensionWithdrawalPlanner';
import ExportOptions from '@/components/calculator/ExportOptions';
import InvestorProfileForm from '@/components/calculator/InvestorProfileForm';
import InvestmentStrategy from '@/components/calculator/InvestmentStrategy';
import OpenAIKeyInput from '@/components/calculator/OpenAIKeyInput';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  InvestorProfile, 
  generateInvestmentStrategy, 
  IncomeSource as AlgorithmIncomeSource 
} from '@/utils/investmentAlgorithm';
import { generateOpenAIInvestmentStrategy } from '@/utils/openaiService';

const Calculator = () => {
  const [selectedRegime, setSelectedRegime] = useState<'old' | 'new' | null>(null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOption | null>(null);
  const [finalValue, setFinalValue] = useState<number>(0);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [totalReturns, setTotalReturns] = useState<number>(0);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);
  
  // New states for the investment algorithm
  const [showAlgorithmForm, setShowAlgorithmForm] = useState<boolean>(false);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [investmentStrategy, setInvestmentStrategy] = useState<any>(null);
  
  // New states for OpenAI integration
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [isGeneratingAIStrategy, setIsGeneratingAIStrategy] = useState<boolean>(false);
  
  // Refs for section navigation
  const algorithmSectionRef = useRef<HTMLDivElement>(null);
  const openAISectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const total = incomeSources.reduce((sum, source) => sum + (source.amount || 0), 0);
    setTotalIncome(total);
  }, [incomeSources]);
  
  useEffect(() => {
    // Check if URL has a hash and scroll to that section
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);
  
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

  const handleReturnCalculation = (finalVal: number, investedAmount: number, returns: number, years: number) => {
    setFinalValue(finalVal);
    setTotalInvested(investedAmount);
    setTotalReturns(returns);
    setTimeHorizon(years);
  };
  
  const handleShowAlgorithmForm = () => {
    setShowAlgorithmForm(true);
    setShowApiKeyInput(false);
    setTimeout(() => {
      if (algorithmSectionRef.current) {
        algorithmSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleShowOpenAIInput = () => {
    setShowApiKeyInput(true);
    setShowAlgorithmForm(false);
    setTimeout(() => {
      if (openAISectionRef.current) {
        openAISectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleProfileUpdate = (profile: InvestorProfile) => {
    setInvestorProfile(profile);
    
    // Convert income sources to the algorithm format if needed
    const algorithmIncomeSources: AlgorithmIncomeSource[] = profile.incomeSources;
    
    // Generate the investment strategy
    const strategy = generateInvestmentStrategy(
      profile,
      totalIncome,
      totalIncome * 0.3 // 30% of annual income for investment
    );
    
    setInvestmentStrategy(strategy);
  };
  
  const handleRegenerateStrategy = () => {
    if (investorProfile) {
      handleProfileUpdate(investorProfile);
    }
  };
  
  const handleOpenAIGenerate = async (apiKey: string) => {
    if (!investorProfile) {
      toast.error('Please fill out your investor profile first');
      setShowAlgorithmForm(true);
      setShowApiKeyInput(false);
      return;
    }
    
    setIsGeneratingAIStrategy(true);
    
    try {
      const aiStrategy = await generateOpenAIInvestmentStrategy(
        apiKey,
        investorProfile,
        totalIncome,
        totalIncome * 0.3 // 30% of annual income for investment
      );
      
      if (aiStrategy) {
        setInvestmentStrategy(aiStrategy);
        toast.success('AI-powered investment strategy generated successfully');
      }
    } catch (error) {
      console.error('Error generating AI strategy:', error);
      toast.error('Failed to generate AI strategy. Please try again.');
    } finally {
      setIsGeneratingAIStrategy(false);
    }
  };
  
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
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={handleShowAlgorithmForm}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Generate Standard Investment Strategy
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleShowOpenAIInput}
                  className="flex items-center gap-2"
                >
                  <CalculatorIcon className="h-5 w-5" />
                  Generate AI-Powered Strategy
                </Button>
              </div>
            )}
            
            {/* OpenAI API Key Input Section */}
            <div id="openai" ref={openAISectionRef}>
              {showApiKeyInput && totalIncome > 0 && (
                <>
                  <OpenAIKeyInput 
                    onSubmit={handleOpenAIGenerate}
                    isLoading={isGeneratingAIStrategy}
                  />
                  
                  {!investorProfile && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <p className="text-center text-muted-foreground">
                        You need to create your investor profile first. Please fill out the form below:
                      </p>
                      <div className="mt-4">
                        <InvestorProfileForm 
                          initialIncomeSources={incomeSources.map(source => ({
                            type: source.type as any || 'other',
                            amount: source.amount,
                            frequency: 'monthly',
                            stability: 7
                          }))}
                          totalIncome={totalIncome}
                          onProfileUpdate={handleProfileUpdate}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* AI Investment Algorithm Section */}
            <div id="algorithm" ref={algorithmSectionRef}>
              {showAlgorithmForm && totalIncome > 0 && (
                <>
                  {!investmentStrategy ? (
                    <InvestorProfileForm 
                      initialIncomeSources={incomeSources.map(source => ({
                        type: source.type as any || 'other',
                        amount: source.amount,
                        frequency: 'monthly',
                        stability: 7
                      }))}
                      totalIncome={totalIncome}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  ) : (
                    <InvestmentStrategy 
                      isi={investmentStrategy.isi}
                      incomeCategories={investmentStrategy.incomeCategories}
                      riskScore={investmentStrategy.riskScore}
                      assetAllocation={investmentStrategy.assetAllocation}
                      specificRecommendations={investmentStrategy.specificRecommendations}
                      taxSuggestions={investmentStrategy.taxSuggestions}
                      monthlyInvestmentAmount={recommendedMonthlyInvestment}
                      onRegenerate={handleRegenerateStrategy}
                    />
                  )}
                </>
              )}
            </div>
            
            <div id="investment-summary">
              {totalIncome > 0 && (
                <InvestmentRecommendationsWithExport
                  incomeTotal={totalIncome}
                  onSelect={handleInvestmentSelect}
                  selectedOption={selectedInvestment}
                  incomeSources={incomeSources}
                  taxRegime={selectedRegime}
                  recommendedMonthlyInvestment={recommendedMonthlyInvestment}
                  timeHorizon={timeHorizon}
                />
              )}
              
              <ReturnCalculator
                selectedInvestment={selectedInvestment}
                recommendedMonthly={recommendedMonthlyInvestment}
                onCalculate={handleReturnCalculation}
              />
              
              <ExportOptions
                taxRegime={selectedRegime}
                incomeSources={incomeSources}
                totalIncome={totalIncome}
                selectedInvestment={selectedInvestment}
                recommendedMonthlyInvestment={recommendedMonthlyInvestment}
                timeHorizon={timeHorizon}
                finalValue={finalValue}
                totalInvested={totalInvested}
                totalReturns={totalReturns}
              />
            </div>
            
            <div id="analytics">
              <StockMarketData />
            </div>
            
            <div id="portfolio">
              {totalIncome > 0 && (
                <PensionWithdrawalPlanner
                  currentIncome={totalIncome}
                  pensionCorpus={totalIncome * 10}
                />
              )}
            </div>
            
            <div id="retirement">
              {totalIncome > 0 && (
                <RetirementDashboard
                  currentIncome={totalIncome}
                  selectedInvestment={selectedInvestment}
                  recommendedMonthlyInvestment={recommendedMonthlyInvestment}
                />
              )}
            </div>
            
            <div id="tax-regime">
              {/* Any additional tax planning content can go here */}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calculator;
