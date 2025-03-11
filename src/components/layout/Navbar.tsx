
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calculator, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { name: 'Calculator', path: '/calculator', icon: <Calculator className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-medium text-xl"
        >
          <span className="relative font-semibold">
            <span className="absolute -left-2 -top-1 text-3xl text-primary/20">$</span>
            <span className="relative z-10">TaxSmart</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center text-sm font-medium transition-colors duration-200 relative group',
                isActive(link.path) 
                  ? 'text-primary' 
                  : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {link.icon}
              {link.name}
              {isActive(link.path) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>
          ))}
          <Button size="sm" className="rounded-full">
            Get Started
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden glass mt-2 rounded-xl p-4 mx-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 flex items-center rounded-lg text-sm font-medium transition-colors',
                  isActive(link.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-secondary text-foreground/70'
                )}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
            <Button size="sm" className="mt-2 w-full">
              Get Started
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
