
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block animate-fade-in px-4 py-1.5 mb-8 text-sm font-medium bg-primary/10 text-primary rounded-full backdrop-blur-sm border border-primary/20">
            Intelligent Tax Planning & Investment Strategy
          </span>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Optimize Your Taxes,</span>
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Maximize Your Future
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-xl text-muted-foreground animate-slide-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] leading-relaxed">
            Make informed financial decisions with our sophisticated tax calculation and investment recommendation tools, meticulously tailored to your income profile and long-term goals.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-5 animate-slide-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base">
              <Link to="/calculator" className="group">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base backdrop-blur-sm border-primary/20">
              Explore Features
            </Button>
          </div>
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 animate-fade-in opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">99%</div>
              <p className="mt-3 text-sm text-muted-foreground text-center">Tax Optimization Accuracy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">₹35K+</div>
              <p className="mt-3 text-sm text-muted-foreground text-center">Average Annual Savings</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">4.9/5</div>
              <p className="mt-3 text-sm text-muted-foreground text-center">Customer Satisfaction</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">18%</div>
              <p className="mt-3 text-sm text-muted-foreground text-center">Average Return on Investments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
