
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Plane, Heart, Briefcase } from 'lucide-react';

interface LifestyleCategory {
  type: string;
  location?: string;
  frequency?: string;
  coverage?: string;
  quality?: string;
  activities?: string[];
  destinations?: string[];
  description: string;
}

interface LifestyleCardsProps {
  housing: LifestyleCategory;
  travel: LifestyleCategory;
  healthcare: LifestyleCategory;
  lifestyle: LifestyleCategory;
}

const LifestyleCards: React.FC<LifestyleCardsProps> = ({
  housing,
  travel,
  healthcare,
  lifestyle,
}) => {
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-3">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Housing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="font-medium">{housing.type}</div>
          <div className="text-sm text-muted-foreground">
            {housing.location}
          </div>
          <CardDescription className="mt-2">
            {housing.description}
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
          <div className="font-medium">{travel.frequency}</div>
          <div className="text-sm text-muted-foreground">
            {travel.destinations?.join(', ')}
          </div>
          <CardDescription className="mt-2">
            {travel.description}
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
          <div className="font-medium">{healthcare.quality}</div>
          <div className="text-sm text-muted-foreground">
            {healthcare.coverage} Coverage
          </div>
          <CardDescription className="mt-2">
            {healthcare.description}
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
          <div className="font-medium">{lifestyle.type}</div>
          <div className="text-sm text-muted-foreground">
            {lifestyle.activities?.join(', ')}
          </div>
          <CardDescription className="mt-2">
            {lifestyle.description}
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
};

export default LifestyleCards;
