
import React, { useState, useEffect } from 'react';
import { InvestmentOption } from './InvestmentRecommendations';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ReturnCalculatorProps {
  selectedInvestment: InvestmentOption | null;
  recommendedMonthly: number;
  onCalculate?: (finalValue: number, totalInvested: number, totalReturns: number, years: number) => void;
}

const ReturnCalculator: React.FC<ReturnCalculatorProps> = ({
  selectedInvestment,
  recommendedMonthly,
  onCalculate
}) => {
  const [amount, setAmount] = useState(recommendedMonthly || 10000);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState('monthly');
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    if (!selectedInvestment) return;
    
    generateChartData();
  }, [selectedInvestment, amount, years, frequency]);
  
  useEffect(() => {
    if (recommendedMonthly) {
      setAmount(recommendedMonthly);
    }
  }, [recommendedMonthly]);
  
  useEffect(() => {
    if (selectedInvestment && onCalculate) {
      // Calculate values for export
      const totalInvested = frequency === 'monthly' 
        ? amount * 12 * years 
        : amount * years;
        
      const rate = selectedInvestment.expectedReturn / 100;
      const periodsPerYear = frequency === 'monthly' ? 12 : 1;
      const ratePerPeriod = frequency === 'monthly' ? rate / 12 : rate;
      
      // Final value calculation for regular investments
      let finalValue = 0;
      if (frequency === 'monthly') {
        // For monthly investments using compound interest formula for periodic payments
        finalValue = amount * ((Math.pow(1 + ratePerPeriod, periodsPerYear * years) - 1) / ratePerPeriod) * (1 + ratePerPeriod);
      } else {
        // For yearly investments
        let yearlyValue = 0;
        for (let i = 0; i < years; i++) {
          yearlyValue = (yearlyValue + amount) * (1 + rate);
        }
        finalValue = yearlyValue;
      }
      
      // Calculate returns
      const totalReturns = finalValue - totalInvested;
      
      onCalculate(Math.round(finalValue), Math.round(totalInvested), Math.round(totalReturns), years);
    }
  }, [selectedInvestment, amount, years, frequency, onCalculate]);
  
  const generateChartData = () => {
    if (!selectedInvestment) return;
    
    const rate = selectedInvestment.expectedReturn / 100;
    const periodsPerYear = frequency === 'monthly' ? 12 : 1;
    const totalPeriods = years * periodsPerYear;
    
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    const investedData = [];
    const projectedData = [];
    
    // Calculate for each period
    let totalInvested = 0;
    let currentValue = 0;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        // Initial state
        investedData.push(0);
        projectedData.push(0);
      } else {
        const periodicAmount = frequency === 'monthly' ? amount : amount * 12;
        
        // Calculate for each month within the year if monthly
        if (frequency === 'monthly') {
          for (let month = 1; month <= 12; month++) {
            totalInvested += amount;
            currentValue = (currentValue + amount) * (1 + (rate / 12));
          }
        } else {
          // Yearly calculation
          totalInvested += periodicAmount;
          currentValue = (currentValue + periodicAmount) * (1 + rate);
        }
        
        investedData.push(Math.round(totalInvested));
        projectedData.push(Math.round(currentValue));
      }
    }
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Amount Invested',
          data: investedData,
          borderColor: 'rgba(156, 163, 175, 1)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Projected Value',
          data: projectedData,
          borderColor: 'rgba(var(--primary), 1)',
          backgroundColor: 'rgba(var(--primary), 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    });
  };

  if (!selectedInvestment) {
    return (
      <div className="rounded-xl p-6 glass">
        <div className="text-center p-8">
          <h3 className="text-xl font-medium mb-2">Select an Investment Option</h3>
          <p className="text-muted-foreground">
            Choose an investment option above to calculate potential returns.
          </p>
        </div>
      </div>
    );
  }

  // Calculate total invested and projected final value
  const totalInvested = frequency === 'monthly' 
    ? amount * 12 * years 
    : amount * years;
    
  const rate = selectedInvestment.expectedReturn / 100;
  const periodsPerYear = frequency === 'monthly' ? 12 : 1;
  const ratePerPeriod = frequency === 'monthly' ? rate / 12 : rate;
  
  // Final value calculation for regular investments
  let finalValue = 0;
  if (frequency === 'monthly') {
    // For monthly investments using compound interest formula for periodic payments
    finalValue = amount * ((Math.pow(1 + ratePerPeriod, periodsPerYear * years) - 1) / ratePerPeriod) * (1 + ratePerPeriod);
  } else {
    // For yearly investments
    let yearlyValue = 0;
    for (let i = 0; i < years; i++) {
      yearlyValue = (yearlyValue + amount) * (1 + rate);
    }
    finalValue = yearlyValue;
  }
  
  // Calculate returns
  const totalReturns = finalValue - totalInvested;
  const multiplier = finalValue / totalInvested;

  return (
    <div className="rounded-xl p-6 glass">
      <h3 className="text-xl font-semibold mb-6">Return Calculator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
              <span className="text-sm text-muted-foreground">per {frequency}</span>
            </div>
            <Input
              id="investment-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mb-1"
            />
          </div>
          
          <div>
            <Label htmlFor="frequency" className="mb-2 block">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Time Period</Label>
              <span className="text-sm font-medium">{years} Years</span>
            </div>
            <Slider
              value={[years]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => setYears(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 pt-4">
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                <p className="text-lg font-bold">₹{Math.round(totalInvested).toLocaleString('en-IN')}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <p className="text-xs text-muted-foreground mb-1">Est. Returns</p>
                <p className="text-lg font-bold text-primary">₹{Math.round(totalReturns).toLocaleString('en-IN')}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <p className="text-xs text-muted-foreground mb-1">Final Value</p>
                <p className="text-lg font-bold">₹{Math.round(finalValue).toLocaleString('en-IN')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">{selectedInvestment.name}</h4>
              <span className="text-sm font-medium">{selectedInvestment.expectedReturn}% p.a.</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedInvestment.description}
            </p>
            <div className="text-sm">
              <span className="font-medium">Results:</span> Your money could grow {multiplier.toFixed(2)}x in {years} years
            </div>
          </div>
          
          <div className="h-64">
            {chartData && (
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        boxWidth: 6
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          label += '₹' + context.parsed.y.toLocaleString('en-IN');
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          if (typeof value === 'number') {
                            if (value >= 1000000) {
                              return '₹' + (value / 1000000).toFixed(1) + 'M';
                            } else if (value >= 1000) {
                              return '₹' + (value / 1000).toFixed(0) + 'K';
                            }
                            return '₹' + value;
                          }
                          return value;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnCalculator;
