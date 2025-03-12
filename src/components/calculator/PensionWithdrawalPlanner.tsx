
import React, { useState, useEffect } from 'react';
import { Calculator, Wallet, AlertCircle, ArrowUpDown, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Types for withdrawal strategies
interface WithdrawalOption {
  id: string;
  name: string;
  description: string;
  taxImpact: 'Low' | 'Medium' | 'High';
  monthlyIncome: number;
  lumpsum: number;
  longTermSustainability: number; // 0-100
}

interface PensionWithdrawalPlannerProps {
  currentAge?: number;
  retirementAge?: number;
  currentIncome: number;
  pensionCorpus?: number;
}

const PensionWithdrawalPlanner: React.FC<PensionWithdrawalPlannerProps> = ({
  currentAge = 30,
  retirementAge = 60,
  currentIncome,
  pensionCorpus,
}) => {
  // Calculate estimated pension corpus if not provided
  const estimatedCorpus = pensionCorpus || Math.round(currentIncome * 8 * (retirementAge - currentAge) * 0.2);
  
  // State for user inputs
  const [corpus, setCorpus] = useState<number>(estimatedCorpus);
  const [withdrawalPhase, setWithdrawalPhase] = useState<number>(20); // Expected years in retirement
  const [lumpsumPercentage, setLumpsumPercentage] = useState<number>(40); // Default to 40% lumpsum (as per NPS rules)
  const [taxBracket, setTaxBracket] = useState<number>(20); // Assumed tax rate in retirement (in percentage)
  
  // Generate withdrawal options based on user inputs
  const [withdrawalOptions, setWithdrawalOptions] = useState<WithdrawalOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<WithdrawalOption | null>(null);

  // Calculate withdrawal options whenever inputs change
  useEffect(() => {
    if (corpus <= 0) return;
    
    // Calculate options
    const lumpsumAmount = (corpus * lumpsumPercentage) / 100;
    const annuityAmount = corpus - lumpsumAmount;
    
    const monthlyAnnuityStandard = Math.round(annuityAmount / (withdrawalPhase * 12));
    const monthlyAnnuityAggressive = Math.round((annuityAmount / (withdrawalPhase * 12)) * 1.3);
    const monthlyAnnuityConservative = Math.round((annuityAmount / (withdrawalPhase * 12)) * 0.8);
    
    // Tax impact calculations
    const standardTaxImpact = (monthlyAnnuityStandard * 12 * taxBracket) / 100;
    const aggressiveTaxImpact = (monthlyAnnuityAggressive * 12 * taxBracket) / 100;
    const conservativeTaxImpact = (monthlyAnnuityConservative * 12 * taxBracket) / 100;
    
    // Generate options
    const options: WithdrawalOption[] = [
      {
        id: 'balanced',
        name: 'Balanced Withdrawal',
        description: 'A balanced approach with steady monthly income and moderate tax efficiency.',
        taxImpact: 'Medium',
        monthlyIncome: monthlyAnnuityStandard,
        lumpsum: Math.round(lumpsumAmount),
        longTermSustainability: 70,
      },
      {
        id: 'tax-optimized',
        name: 'Tax-Optimized Strategy',
        description: 'Minimizes tax impact by strategically timing withdrawals across tax years.',
        taxImpact: 'Low',
        monthlyIncome: Math.round(monthlyAnnuityStandard * 0.9),
        lumpsum: Math.round(lumpsumAmount * 1.1),
        longTermSustainability: 65,
      },
      {
        id: 'income-focused',
        name: 'Income-Focused Plan',
        description: 'Maximizes monthly income at the cost of higher taxes and lower lumpsum.',
        taxImpact: 'High',
        monthlyIncome: monthlyAnnuityAggressive,
        lumpsum: Math.round(lumpsumAmount * 0.8),
        longTermSustainability: 50,
      },
      {
        id: 'longevity',
        name: 'Longevity Protection',
        description: 'Conservative withdrawals to ensure funds last through extended retirement.',
        taxImpact: 'Low',
        monthlyIncome: monthlyAnnuityConservative,
        lumpsum: Math.round(lumpsumAmount * 0.9),
        longTermSustainability: 90,
      },
    ];
    
    setWithdrawalOptions(options);
    setSelectedOption(null);
  }, [corpus, withdrawalPhase, lumpsumPercentage, taxBracket]);

  const handleOptionSelect = (option: WithdrawalOption) => {
    setSelectedOption(option);
    toast.success(`${option.name} selected as your withdrawal strategy`);
  };

  const getTaxImpactColor = (impact: 'Low' | 'Medium' | 'High') => {
    switch (impact) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-amber-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="rounded-xl p-6 glass">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Dynamic Pension Withdrawal Planner</h3>
          <p className="text-muted-foreground">Optimize your retirement withdrawals for maximum income and tax efficiency</p>
        </div>
        <div className="bg-primary/10 text-primary p-2 rounded-full">
          <Calculator className="h-6 w-6" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Customize Your Plan</CardTitle>
            <CardDescription>Adjust these parameters to see different withdrawal options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Estimated Pension Corpus</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">₹{corpus.toLocaleString('en-IN')}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            This is an estimate based on your current income and years until retirement. You can adjust it to match your expected pension amount.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Slider
                  value={[corpus]}
                  min={1000000}
                  max={50000000}
                  step={100000}
                  onValueChange={(value) => setCorpus(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Expected Retirement Duration (years)</label>
                  <span className="font-bold">{withdrawalPhase} years</span>
                </div>
                <Slider
                  value={[withdrawalPhase]}
                  min={10}
                  max={40}
                  step={1}
                  onValueChange={(value) => setWithdrawalPhase(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Lumpsum Withdrawal (%)</label>
                  <span className="font-bold">{lumpsumPercentage}%</span>
                </div>
                <Slider
                  value={[lumpsumPercentage]}
                  min={0}
                  max={60}
                  step={5}
                  onValueChange={(value) => setLumpsumPercentage(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  NPS allows up to 60% as lumpsum, with the rest used for purchasing an annuity
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Expected Tax Rate in Retirement</label>
                  <span className="font-bold">{taxBracket}%</span>
                </div>
                <Slider
                  value={[taxBracket]}
                  min={0}
                  max={30}
                  step={5}
                  onValueChange={(value) => setTaxBracket(value[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Key Insights</CardTitle>
            <CardDescription>Optimize your withdrawals based on these factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-foreground p-3">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Tax-Efficient Withdrawals</h4>
                    <p className="text-sm text-muted-foreground">
                      Strategic withdrawals across tax years can reduce your overall tax burden by up to 25%.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-primary-foreground p-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Lumpsum vs. Annuity Balance</h4>
                    <p className="text-sm text-muted-foreground">
                      Taking the full 60% lumpsum might seem appealing, but could reduce your monthly income by 50% or more.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-primary-foreground p-3">
                <div className="flex items-start gap-3">
                  <ArrowUpDown className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Inflation Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Conservative early withdrawals allow for increased income in later years, protecting against inflation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 border border-dashed border-primary/40 rounded-lg bg-primary/5">
                <p className="text-center text-sm">
                  <span className="font-medium">Suggested Monthly Retirement Income: </span>
                  <span className="font-bold text-base">₹{Math.round(corpus / (withdrawalPhase * 12) * 0.7).toLocaleString('en-IN')}</span>
                </p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Based on your inputs and recommended withdrawal rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h4 className="text-lg font-medium mb-3">Recommended Withdrawal Strategies</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {withdrawalOptions.map((option) => (
          <Card 
            key={option.id} 
            className={`cursor-pointer hover:border-primary transition-all duration-200 ${selectedOption?.id === option.id ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{option.name}</CardTitle>
              <CardDescription className="line-clamp-2">{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Monthly Income</div>
                  <div className="text-xl font-bold">₹{option.monthlyIncome.toLocaleString('en-IN')}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Lumpsum Amount</div>
                  <div className="font-semibold">₹{option.lumpsum.toLocaleString('en-IN')}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">Tax Impact</div>
                  <div className={`font-medium ${getTaxImpactColor(option.taxImpact)}`}>{option.taxImpact}</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Long-term Sustainability</span>
                    <span>{option.longTermSustainability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${option.longTermSustainability}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedOption && (
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <h4 className="font-medium mb-2">Selected Strategy: {selectedOption.name}</h4>
          <p className="text-sm text-muted-foreground mb-3">{selectedOption.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background rounded p-3">
              <div className="text-xs text-muted-foreground">Monthly Income</div>
              <div className="text-xl font-bold">₹{selectedOption.monthlyIncome.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-background rounded p-3">
              <div className="text-xs text-muted-foreground">Lumpsum</div>
              <div className="text-xl font-bold">₹{selectedOption.lumpsum.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-background rounded p-3">
              <div className="text-xs text-muted-foreground">Annual Tax Savings</div>
              <div className="text-xl font-bold">₹{Math.round(corpus * 0.04 * (taxBracket / 100) * (selectedOption.id === 'tax-optimized' ? 0.7 : selectedOption.id === 'longevity' ? 0.8 : 1)).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">Generate Detailed Report</Button>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          This planner provides general guidance. Consider consulting a financial advisor for personalized withdrawal strategies.
        </p>
      </div>
    </div>
  );
};

export default PensionWithdrawalPlanner;
