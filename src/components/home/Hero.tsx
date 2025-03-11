
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block animate-fade-in px-3 py-1 mb-6 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Intelligent Tax Planning & Investment Strategy
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="block">Optimize Your Taxes,</span>
            <span className="block mt-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Maximize Your Investments
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground animate-slide-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            Make informed financial decisions with our advanced tax calculation and investment recommendation tools tailored to your income profile and financial goals.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/calculator" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Learn More
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">99%</div>
              <p className="mt-2 text-sm text-muted-foreground text-center">Tax Optimization Accuracy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">₹35K+</div>
              <p className="mt-2 text-sm text-muted-foreground text-center">Average Annual Savings</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <p className="mt-2 text-sm text-muted-foreground text-center">Customer Satisfaction</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">18%</div>
              <p className="mt-2 text-sm text-muted-foreground text-center">Average Return on Investments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
