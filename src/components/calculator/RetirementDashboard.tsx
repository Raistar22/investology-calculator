
import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Home, Plane, Briefcase, Heart, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { InvestmentOption } from './InvestmentRecommendations';

interface RetirementProjection {
  housing: {
    type: string;
    location: string;
    description: string;
  };
  travel: {
    frequency: string;
    destinations: string[];
    description: string;
  };
  healthcare: {
    coverage: string;
    quality: string;
    description: string;
  };
  lifestyle: {
    type: string;
    activities: string[];
    description: string;
  };
  monthlyIncome: number;
  annualIncome: number;
}

interface RetirementDashboardProps {
  currentAge?: number;
  retirementAge?: number;
  currentIncome: number;
  selectedInvestment: InvestmentOption | null;
  recommendedMonthlyInvestment: number;
}

const RetirementDashboard: React.FC<RetirementDashboardProps> = ({
  currentAge = 30,
  retirementAge = 60,
  currentIncome,
  selectedInvestment,
  recommendedMonthlyInvestment,
}) => {
  const [projection, setProjection] = useState<RetirementProjection | null>(null);
  const [savingProgress, setSavingProgress] = useState<number>(0);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  
  // Calculate retirement projections based on income and investments
  useEffect(() => {
    if (currentIncome <= 0) return;
    
    // Years until retirement
    const yearsToRetirement = retirementAge - currentAge;
    
    // Set time progress
    setTimeProgress(Math.min(Math.max((currentAge / retirementAge) * 100, 0), 100));
    
    // Investment calculations
    const monthlyInvestment = recommendedMonthlyInvestment;
    const expectedReturnRate = selectedInvestment ? selectedInvestment.expectedReturn / 100 : 0.08;
    
    // Calculate future value using compound interest formula
    // FV = P(1 + r)^n + PMT × [(1 + r)^n - 1] / r
    const annualInvestment = monthlyInvestment * 12;
    const futureValue = annualInvestment * ((Math.pow(1 + expectedReturnRate, yearsToRetirement) - 1) / expectedReturnRate);
    
    // Assuming a 4% withdrawal rate in retirement (common rule of thumb)
    const estimatedAnnualRetirementIncome = futureValue * 0.04;
    const estimatedMonthlyRetirementIncome = estimatedAnnualRetirementIncome / 12;
    
    // Calculate saving progress (how much of recommended saving they're doing)
    // We're using a default 70% as a placeholder since we don't have actual user savings data
    setSavingProgress(70);
    
    // Determine lifestyle tiers based on monthly retirement income
    let housing, travel, healthcare, lifestyle;
    
    if (estimatedMonthlyRetirementIncome < 30000) {
      housing = {
        type: "1-BHK Apartment",
        location: "Tier-2 City",
        description: "A comfortable apartment in a tier-2 city like Pune or Jaipur."
      };
      travel = {
        frequency: "Occasional",
        destinations: ["Domestic destinations", "Budget trips"],
        description: "Domestic travel once a year to popular tourist destinations."
      };
      healthcare = {
        coverage: "Basic",
        quality: "Government/Affordable Private",
        description: "Basic health insurance with access to standard medical care."
      };
      lifestyle = {
        type: "Modest",
        activities: ["Local entertainment", "Public transport"],
        description: "A comfortable lifestyle with occasional dining out and local activities."
      };
    } else if (estimatedMonthlyRetirementIncome < 80000) {
      housing = {
        type: "2-BHK Apartment",
        location: "Major City Suburbs",
        description: "A spacious apartment in suburbs of cities like Bangalore or Mumbai."
      };
      travel = {
        frequency: "Regular",
        destinations: ["Domestic luxury", "Occasional international"],
        description: "Annual international trip and regular domestic getaways."
      };
      healthcare = {
        coverage: "Comprehensive",
        quality: "Private Hospitals",
        description: "Good health insurance with access to quality private hospitals."
      };
      lifestyle = {
        type: "Comfortable",
        activities: ["Regular dining out", "Entertainment", "Own vehicle"],
        description: "A lifestyle that includes regular social activities and entertainment."
      };
    } else {
      housing = {
        type: "Villa or Premium Apartment",
        location: "Prime Locations",
        description: "A premium property in Goa, Mumbai, or other prime locations."
      };
      travel = {
        frequency: "Frequent",
        destinations: ["International luxury", "Multiple annual trips"],
        description: "Multiple international trips per year including luxury destinations."
      };
      healthcare = {
        coverage: "Premium",
        quality: "Best Private Hospitals",
        description: "Top-tier health coverage with access to the best healthcare facilities."
      };
      lifestyle = {
        type: "Luxury",
        activities: ["Clubs", "Fine dining", "Luxury experiences"],
        description: "A luxurious lifestyle with premium experiences and activities."
      };
    }
    
    setProjection({
      housing,
      travel,
      healthcare,
      lifestyle,
      monthlyIncome: Math.round(estimatedMonthlyRetirementIncome),
      annualIncome: Math.round(estimatedAnnualRetirementIncome)
    });
    
  }, [currentIncome, currentAge, retirementAge, selectedInvestment, recommendedMonthlyInvestment]);

  if (!projection) {
    return (
      <div className="rounded-xl p-6 glass text-center">
        <h3 className="text-xl font-semibold">Retirement Lifestyle Projection</h3>
        <p className="text-muted-foreground mt-2">
          Add income sources and select an investment strategy to see your retirement lifestyle projection.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 glass">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Retirement Lifestyle Projection</h3>
        <p className="text-muted-foreground mt-1">
          Based on your current inputs, here's what your retirement could look like at age {retirementAge}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Post-Retirement Income</CardTitle>
              <CircleDollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly</span>
                <span className="text-xl font-bold">₹{projection.monthlyIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual</span>
                <span className="text-xl font-bold">₹{projection.annualIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Retirement Progress</CardTitle>
              <User className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time Progress</span>
                  <span>{Math.round(timeProgress)}%</span>
                </div>
                <Progress value={timeProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  You have {retirementAge - currentAge} years until retirement
                </p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Saving Progress</span>
                  <span>{savingProgress}%</span>
                </div>
                <Progress value={savingProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Of recommended monthly investment of ₹{recommendedMonthlyInvestment.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Housing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="font-medium">{projection.housing.type}</div>
            <div className="text-sm text-muted-foreground">
              {projection.housing.location}
            </div>
            <CardDescription className="mt-2">
              {projection.housing.description}
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Travel</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="font-medium">{projection.travel.frequency}</div>
            <div className="text-sm text-muted-foreground">
              {projection.travel.destinations.join(', ')}
            </div>
            <CardDescription className="mt-2">
              {projection.travel.description}
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Healthcare</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="font-medium">{projection.healthcare.quality}</div>
            <div className="text-sm text-muted-foreground">
              {projection.healthcare.coverage} Coverage
            </div>
            <CardDescription className="mt-2">
              {projection.healthcare.description}
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Lifestyle</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="font-medium">{projection.lifestyle.type}</div>
            <div className="text-sm text-muted-foreground">
              {projection.lifestyle.activities.join(', ')}
            </div>
            <CardDescription className="mt-2">
              {projection.lifestyle.description}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          These projections are based on your current financial information and market assumptions. Actual results may vary.
        </p>
        <Button variant="outline" size="sm">
          Adjust Retirement Goals
        </Button>
      </div>
    </div>
  );
};

export default RetirementDashboard;
