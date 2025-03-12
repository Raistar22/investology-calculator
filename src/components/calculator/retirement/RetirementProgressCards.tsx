
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User } from 'lucide-react';

interface RetirementProgressCardsProps {
  timeProgress: number;
  savingProgress: number;
  retirementAge: number;
  currentAge: number;
  recommendedMonthlyInvestment: number;
}

const RetirementProgressCards: React.FC<RetirementProgressCardsProps> = ({
  timeProgress,
  savingProgress,
  retirementAge,
  currentAge,
  recommendedMonthlyInvestment,
}) => {
  return (
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
  );
};

export default RetirementProgressCards;
