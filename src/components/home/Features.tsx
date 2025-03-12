
import React from 'react';
import { Calculator, PiggyBank, TrendingUp, FilePieChart, Shield, Clock, RefreshCw, BarChart3 } from 'lucide-react';
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
  {
    title: "Secure Data Protection",
    description: "Your financial information is encrypted and protected with enterprise-grade security measures.",
    icon: <Shield className="h-6 w-6" />,
    delay: "600ms",
  },
  {
    title: "Retirement Lifestyle Planning",
    description: "Visualize your post-retirement lifestyle based on current investments and savings patterns.",
    icon: <Clock className="h-6 w-6" />,
    delay: "750ms", 
  },
  {
    title: "Real-time Market Updates",
    description: "Stay informed with latest market trends and how they affect your investment portfolio.",
    icon: <RefreshCw className="h-6 w-6" />,
    delay: "900ms",
  },
  {
    title: "Comprehensive Analytics",
    description: "In-depth analytics and visual representations of your financial health and progress.",
    icon: <BarChart3 className="h-6 w-6" />,
    delay: "1050ms",
  },
];

const Features = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            Advanced Features for Financial Success
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            All the tools you need to manage your taxes and investments in one elegant interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "glass p-8 rounded-2xl card-hover animate-slide-up opacity-0 border border-white/20 backdrop-blur-sm",
                `[animation-delay:${feature.delay}] [animation-fill-mode:forwards]`
              )}
            >
              <div className="bg-primary/10 p-4 rounded-xl inline-flex text-primary mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
