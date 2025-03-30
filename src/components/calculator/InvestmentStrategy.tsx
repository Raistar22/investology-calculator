
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Check, Info, Target, TrendingUp, AlertTriangle, BarChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InvestmentStrategyProps {
  isi: number;
  incomeCategories: { fixed: number; variable: number; passive: number };
  riskScore: number;
  assetAllocation: { [key: string]: number };
  specificRecommendations: { 
    assetClass: string; 
    allocation: number; 
    amount: number; 
    specific: string[] 
  }[];
  taxSuggestions: string[];
  monthlyInvestmentAmount: number;
  onRegenerate: () => void;
}

const InvestmentStrategy: React.FC<InvestmentStrategyProps> = ({
  isi,
  incomeCategories,
  riskScore,
  assetAllocation,
  specificRecommendations,
  taxSuggestions,
  monthlyInvestmentAmount,
  onRegenerate
}) => {
  // Create chart data
  const chartData = {
    labels: Object.keys(assetAllocation).filter(key => assetAllocation[key] > 0),
    datasets: [
      {
        data: Object.values(assetAllocation).filter(value => value > 0),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(201, 203, 207, 0.7)',
          'rgba(94, 114, 228, 0.7)',
          'rgba(43, 206, 141, 0.7)',
          'rgba(251, 99, 64, 0.7)',
          'rgba(136, 135, 255, 0.7)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(94, 114, 228)',
          'rgb(43, 206, 141)',
          'rgb(251, 99, 64)',
          'rgb(136, 135, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };
  
  // Risk profile text
  const getRiskProfileText = () => {
    if (riskScore <= 3) return "Conservative";
    if (riskScore <= 7) return "Moderate";
    return "Aggressive";
  };
  
  const getRiskColor = () => {
    if (riskScore <= 3) return "bg-green-500";
    if (riskScore <= 7) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Investment Strategy</CardTitle>
              <CardDescription>
                Personalized investment allocation based on your profile
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onRegenerate}>Regenerate</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Investment</p>
                    <h3 className="text-2xl font-bold mt-1">₹{monthlyInvestmentAmount.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="p-2 bg-primary/20 rounded-full text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Income Stability</p>
                    <h3 className="text-2xl font-bold mt-1">{isi.toFixed(1)}/10</h3>
                  </div>
                  <div className="p-2 bg-primary/20 rounded-full text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <Progress value={isi * 10} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Profile</p>
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-2xl font-bold">{getRiskProfileText()}</h3>
                      <div className={`w-3 h-3 rounded-full ${getRiskColor()}`}></div>
                    </div>
                  </div>
                  <div className="p-2 bg-primary/20 rounded-full text-primary">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <Progress value={riskScore * 10} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>
          
          {/* Income Categories Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Income Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fixed Income</span>
                  <span className="text-sm font-bold">{incomeCategories.fixed}%</span>
                </div>
                <Progress value={incomeCategories.fixed} className="h-2" />
              </div>
              <div className="p-3 border rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Variable Income</span>
                  <span className="text-sm font-bold">{incomeCategories.variable}%</span>
                </div>
                <Progress value={incomeCategories.variable} className="h-2" />
              </div>
              <div className="p-3 border rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Passive Income</span>
                  <span className="text-sm font-bold">{incomeCategories.passive}%</span>
                </div>
                <Progress value={incomeCategories.passive} className="h-2" />
              </div>
            </div>
          </div>
          
          {/* Asset Allocation Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
              <div className="h-[300px]">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Investment Breakdown</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p className="text-sm">
                        This investment breakdown is optimized based on your risk profile, income stability, and financial goals.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {specificRecommendations.map((rec, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{rec.assetClass}</span>
                      <Badge variant="outline">{rec.allocation}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      ₹{rec.amount.toLocaleString('en-IN')}
                    </div>
                    <Progress value={rec.allocation} className="h-1.5 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      {rec.specific.map((item, i) => (
                        <div key={i} className="flex items-start gap-1 mt-1">
                          <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tabs for Additional Information */}
          <Tabs defaultValue="recommendations">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="recommendations" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Investment Actions</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Tax Optimization</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="mt-4 space-y-3">
              <h3 className="text-lg font-medium">Recommended Actions</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="font-medium mb-1">Investment Schedule</div>
                  <p className="text-sm text-muted-foreground">
                    Invest ₹{monthlyInvestmentAmount.toLocaleString('en-IN')} monthly as per the asset allocation above.
                  </p>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="font-medium mb-1">Auto-Debit Setup</div>
                  <p className="text-sm text-muted-foreground">
                    Set up SIPs (Systematic Investment Plans) for mutual funds and recurring deposits for fixed income.
                  </p>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="font-medium mb-1">Portfolio Rebalancing</div>
                  <p className="text-sm text-muted-foreground">
                    Review and rebalance your portfolio every quarter to maintain the recommended asset allocation.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tax" className="mt-4 space-y-3">
              <h3 className="text-lg font-medium">Tax Optimization Suggestions</h3>
              <div className="space-y-2">
                {taxSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center">
            <Button 
              className="flex items-center gap-2" 
              size="lg"
              onClick={() => window.print()}
            >
              <FileText className="h-4 w-4" />
              Save Investment Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentStrategy;
