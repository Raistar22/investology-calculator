
import React from 'react';
import { Calculator, PiggyBank, TrendingUp, FilePieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Tax Regime Comparison",
    description: "Compare the old and new tax regimes to determine which one is optimal for your specific income and deduction profile.",
    icon: <Calculator className="h-6 w-6" />,
    delay: "0ms",
  },
  {
    title: "Income Source Analysis",
    description: "Detailed analysis of various income sources and their tax implications to help you structure your income efficiently.",
    icon: <FilePieChart className="h-6 w-6" />,
    delay: "150ms",
  },
  {
    title: "Investment Recommendations",
    description: "Personalized investment suggestions based on your risk profile, income, and tax situation for better returns.",
    icon: <PiggyBank className="h-6 w-6" />,
    delay: "300ms",
  },
  {
    title: "Return Projections",
    description: "Real-time calculations showing potential returns across different investment options and time periods.",
    icon: <TrendingUp className="h-6 w-6" />,
    delay: "450ms",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Advanced Features for Financial Success
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            All the tools you need to manage your taxes and investments in one elegant interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "glass p-6 rounded-2xl card-hover animate-slide-up opacity-0",
                `[animation-delay:${feature.delay}] [animation-fill-mode:forwards]`
              )}
            >
              <div className="bg-primary/10 p-3 rounded-xl inline-flex text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
