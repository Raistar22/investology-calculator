
import React, { useState } from 'react';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { InvestorProfile, IncomeSource, FinancialGoal, RiskTolerance, LiquidityPreference, InvestmentExperience } from '@/utils/investmentAlgorithm';

interface InvestorProfileFormProps {
  initialIncomeSources?: IncomeSource[];
  totalIncome: number;
  onProfileUpdate: (profile: InvestorProfile) => void;
}

const InvestorProfileForm: React.FC<InvestorProfileFormProps> = ({
  initialIncomeSources = [],
  totalIncome,
  onProfileUpdate
}) => {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(
    initialIncomeSources.length > 0 
      ? initialIncomeSources 
      : [{ type: 'salary', amount: totalIncome, frequency: 'monthly', stability: 8 }]
  );
  
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('medium');
  const [liquidityPreference, setLiquidityPreference] = useState<LiquidityPreference>('flexible');
  const [investmentExperience, setInvestmentExperience] = useState<InvestmentExperience>('beginner');
  
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    { type: 'short_term', targetAmount: totalIncome * 0.5, timeframe: 2, priority: 7 },
    { type: 'long_term', targetAmount: totalIncome * 5, timeframe: 10, priority: 9 }
  ]);
  
  const [newGoal, setNewGoal] = useState<FinancialGoal>({
    type: 'mid_term',
    targetAmount: 0,
    timeframe: 5,
    priority: 5
  });
  
  const handleIncomeSourceChange = (index: number, field: keyof IncomeSource, value: any) => {
    const updatedSources = [...incomeSources];
    updatedSources[index] = { ...updatedSources[index], [field]: value };
    setIncomeSources(updatedSources);
  };
  
  const handleAddIncomeSource = () => {
    setIncomeSources([
      ...incomeSources,
      { type: 'other', amount: 0, frequency: 'monthly', stability: 5 }
    ]);
  };
  
  const handleRemoveIncomeSource = (index: number) => {
    if (incomeSources.length <= 1) {
      toast.error('You must have at least one income source');
      return;
    }
    
    const updatedSources = incomeSources.filter((_, i) => i !== index);
    setIncomeSources(updatedSources);
  };
  
  const handleGoalChange = (index: number, field: keyof FinancialGoal, value: any) => {
    const updatedGoals = [...financialGoals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setFinancialGoals(updatedGoals);
  };
  
  const handleNewGoalChange = (field: keyof FinancialGoal, value: any) => {
    setNewGoal({ ...newGoal, [field]: value });
  };
  
  const handleAddGoal = () => {
    if (newGoal.targetAmount <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    
    setFinancialGoals([...financialGoals, newGoal]);
    setNewGoal({
      type: 'mid_term',
      targetAmount: 0,
      timeframe: 5,
      priority: 5
    });
  };
  
  const handleRemoveGoal = (index: number) => {
    const updatedGoals = financialGoals.filter((_, i) => i !== index);
    setFinancialGoals(updatedGoals);
  };
  
  const handleSubmitProfile = () => {
    const profile: InvestorProfile = {
      incomeSources,
      riskTolerance,
      financialGoals,
      liquidityPreference,
      investmentExperience,
      currentMarketTrends: {
        stockPerformance: 6, // Default values - in a real app, these would come from an API
        cryptoVolatility: 7,
        bondYields: 5.5,
        inflationRate: 6.2
      }
    };
    
    onProfileUpdate(profile);
    toast.success('Investor profile updated successfully');
  };
  
  const getTotalIncomeFromSources = () => {
    return incomeSources.reduce((sum, source) => sum + source.amount, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investor Profile</CardTitle>
          <CardDescription>
            Complete your investment profile to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Income Sources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Income Sources</h3>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Income Stability</AlertTitle>
              <AlertDescription>
                Your income pattern affects investment recommendations. Multiple stable income sources allow for more aggressive investments.
              </AlertDescription>
            </Alert>
            
            {incomeSources.map((source, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-md">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Income Type</Label>
                    <Select 
                      value={source.type}
                      onValueChange={(value: any) => handleIncomeSourceChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                        <SelectItem value="capital_gains">Capital Gains</SelectItem>
                        <SelectItem value="dividends">Dividends</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input 
                      type="number" 
                      value={source.amount}
                      onChange={(e) => handleIncomeSourceChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Frequency</Label>
                    <Select 
                      value={source.frequency}
                      onValueChange={(value: any) => handleIncomeSourceChange(index, 'frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stability (1-10)</Label>
                    <div className="pt-2">
                      <Slider 
                        value={[source.stability]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => handleIncomeSourceChange(index, 'stability', value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Unstable</span>
                        <span>{source.stability}</span>
                        <span>Very Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {incomeSources.length > 1 && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveIncomeSource(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddIncomeSource}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Income Source
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Total Annual Income: ₹{getTotalIncomeFromSources().toLocaleString('en-IN')}
            </div>
          </div>
          
          {/* Risk Tolerance Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Risk Tolerance</h3>
            <p className="text-sm text-muted-foreground">
              How comfortable are you with investment fluctuations?
            </p>
            <RadioGroup 
              value={riskTolerance} 
              onValueChange={(value: RiskTolerance) => setRiskTolerance(value)}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="low" id="low-risk" />
                <Label htmlFor="low-risk" className="font-medium">Conservative</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="medium" id="medium-risk" />
                <Label htmlFor="medium-risk" className="font-medium">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="high" id="high-risk" />
                <Label htmlFor="high-risk" className="font-medium">Aggressive</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Investment Experience Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Investment Experience</h3>
            <p className="text-sm text-muted-foreground">
              How would you rate your investment knowledge?
            </p>
            <RadioGroup 
              value={investmentExperience} 
              onValueChange={(value: InvestmentExperience) => setInvestmentExperience(value)}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="font-medium">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="font-medium">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="expert" id="expert" />
                <Label htmlFor="expert" className="font-medium">Expert</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Liquidity Preference Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Liquidity Preference</h3>
            <p className="text-sm text-muted-foreground">
              How quickly do you need access to your investments?
            </p>
            <RadioGroup 
              value={liquidityPreference} 
              onValueChange={(value: LiquidityPreference) => setLiquidityPreference(value)}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="font-medium">Immediate Access</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="font-medium">Flexible</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="locked" id="locked" />
                <Label htmlFor="locked" className="font-medium">Long-term Lock-in</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Financial Goals Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Goals</h3>
            
            {financialGoals.map((goal, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-md">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Goal Type</Label>
                    <Select 
                      value={goal.type}
                      onValueChange={(value: any) => handleGoalChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short_term">Short-term (1-3 years)</SelectItem>
                        <SelectItem value="mid_term">Mid-term (3-7 years)</SelectItem>
                        <SelectItem value="long_term">Long-term (7+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Amount (₹)</Label>
                    <Input 
                      type="number" 
                      value={goal.targetAmount}
                      onChange={(e) => handleGoalChange(index, 'targetAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Timeframe (years)</Label>
                    <Input 
                      type="number" 
                      value={goal.timeframe}
                      onChange={(e) => handleGoalChange(index, 'timeframe', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Priority (1-10)</Label>
                    <div className="pt-2">
                      <Slider 
                        value={[goal.priority]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => handleGoalChange(index, 'priority', value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low</span>
                        <span>{goal.priority}</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveGoal(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            
            {/* Add New Goal Form */}
            <div className="space-y-3 p-3 border border-dashed rounded-md">
              <h4 className="font-medium">Add New Goal</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Goal Type</Label>
                  <Select 
                    value={newGoal.type}
                    onValueChange={(value: any) => handleNewGoalChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_term">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="mid_term">Mid-term (3-7 years)</SelectItem>
                      <SelectItem value="long_term">Long-term (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => handleNewGoalChange('targetAmount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Timeframe (years)</Label>
                  <Input 
                    type="number" 
                    value={newGoal.timeframe}
                    onChange={(e) => handleNewGoalChange('timeframe', parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>Priority (1-10)</Label>
                  <div className="pt-2">
                    <Slider 
                      value={[newGoal.priority]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleNewGoalChange('priority', value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>{newGoal.priority}</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddGoal}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmitProfile}
          >
            Generate Investment Strategy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorProfileForm;
