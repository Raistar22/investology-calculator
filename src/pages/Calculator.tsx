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
import FallingMoney from '@/components/animations/FallingMoney';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
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
  const [isGeneratingAIStrategy, setIsGeneratingAIStrategy] = useState<boolean>(false);
  
  // Refs for section navigation
  const algorithmSectionRef = useRef<HTMLDivElement>(null);
  const openAISectionRef = useRef<HTMLDivElement>(null);
  
  // New state for the inactivity animation
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false);
  
  // Setup inactivity timer (20 seconds = 20000ms)
  const { inactive } = useInactivityTimer(
    20000, 
    () => setShowMoneyAnimation(true),
    () => setShowMoneyAnimation(false)
  );

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
    setTimeout(() => {
      if (algorithmSectionRef.current) {
        algorithmSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleShowOpenAIInput = async () => {
    if (totalIncome <= 0) {
      toast.error('Please add your income sources first');
      return;
    }
    
    setIsGeneratingAIStrategy(true);
    
    try {
      // Create a default investor profile if none exists
      const defaultProfile: InvestorProfile = investorProfile || {
        incomeSources: incomeSources.map(source => ({
          type: source.type as any || 'other',
          amount: source.amount,
          frequency: 'monthly',
          stability: 7
        })),
        riskTolerance: 'medium',
        liquidityPreference: 'flexible',
        investmentExperience: 'beginner',
        financialGoals: [
          { type: 'short_term', targetAmount: totalIncome * 0.5, timeframe: 2, priority: 7 },
          { type: 'long_term', targetAmount: totalIncome * 5, timeframe: 10, priority: 9 }
        ],
        currentMarketTrends: {
          stockPerformance: 6,
          cryptoVolatility: 7,
          bondYields: 5.5,
          inflationRate: 6.2
        }
      };
      
      // If no profile exists, set this default one
      if (!investorProfile) {
        setInvestorProfile(defaultProfile);
      }
      
      const aiStrategy = await generateOpenAIInvestmentStrategy(
        defaultProfile,
        totalIncome,
        totalIncome * 0.3 // 30% of annual income for investment
      );
      
      if (aiStrategy) {
        setInvestmentStrategy(aiStrategy);
        setShowAlgorithmForm(true); // Make sure the algorithm section is shown
        toast.success('AI-powered investment strategy generated successfully');
        
        // Scroll to the strategy section
        setTimeout(() => {
          if (algorithmSectionRef.current) {
            algorithmSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error generating AI strategy:', error);
      toast.error('Failed to generate AI strategy. Please try again.');
    } finally {
      setIsGeneratingAIStrategy(false);
    }
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
  
  const recommendedMonthlyInvestment = Math.round((totalIncome * 0.3) / 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Money Animation */}
      <FallingMoney 
        show={showMoneyAnimation} 
        onDismiss={handleDismissAnimation} 
        notesCount={40}
      />
      
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
                  disabled={isGeneratingAIStrategy}
                >
                  <CalculatorIcon className="h-5 w-5" />
                  {isGeneratingAIStrategy ? 'Generating AI Strategy...' : 'Generate AI Strategy'}
                </Button>
              </div>
            )}
            
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
