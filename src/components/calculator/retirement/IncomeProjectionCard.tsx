
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

interface IncomeProjectionCardProps {
  monthlyIncome: number;
  annualIncome: number;
}

const IncomeProjectionCard: React.FC<IncomeProjectionCardProps> = ({
  monthlyIncome,
  annualIncome,
}) => {
  return (
    <Card className="border border-white/20 shadow-md overflow-hidden">
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
            <span className="text-xl font-bold">₹{monthlyIncome.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Annual</span>
            <span className="text-xl font-bold">₹{annualIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeProjectionCard;
