
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        <section className="py-24 bg-background">
          <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="glass overflow-hidden p-0 rounded-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Optimize Your Taxes and Investments?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Use our advanced calculator to determine your optimal tax regime and discover 
                    investment strategies tailored to your financial profile.
                  </p>
                  <div>
                    <Button asChild className="rounded-full">
                      <Link to="/calculator" className="group">
                        Go to Calculator
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-primary/10 p-8 md:p-12 flex items-center justify-center">
                  <div className="aspect-square w-full max-w-xs relative animate-float">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute inset-8 bg-primary/30 rounded-full blur-xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary/80">
                      ₹
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
