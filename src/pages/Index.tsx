
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
        
        <section className="py-28 bg-gradient-to-b from-background to-secondary/30">
          <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="glass overflow-hidden rounded-3xl border border-white/20 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-10 md:p-16 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Ready to Optimize Your Finances?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Use our advanced calculator to determine your optimal tax regime and discover 
                    investment strategies tailored to your unique financial profile.
                  </p>
                  <div>
                    <Button asChild size="lg" className="rounded-full group">
                      <Link to="/calculator" className="group">
                        Go to Calculator
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-primary/5 p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative w-full max-w-sm">
                    <div className="aspect-square w-full relative animate-float">
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
            
            {/* Testimonials section */}
            <div className="mt-28 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block">
                What Our Users Say
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "This platform revolutionized my retirement planning. I now have a clear vision of my future.",
                    author: "Priya S., IT Professional"
                  },
                  {
                    quote: "The tax optimization tools have saved me ₹42,000 this year alone. Incredible value!",
                    author: "Rajesh M., Business Owner"
                  },
                  {
                    quote: "I finally understand where my investments are going and how they'll support my retirement.",
                    author: "Ananya K., Doctor"
                  }
                ].map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="glass p-8 rounded-2xl border border-white/10 flex flex-col items-center animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
                  >
                    <blockquote className="text-lg mb-6 italic">"{testimonial.quote}"</blockquote>
                    <p className="text-primary font-medium">{testimonial.author}</p>
                  </div>
                ))}
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
