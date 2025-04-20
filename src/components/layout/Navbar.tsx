import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calculator, Home, Menu, X, LogIn, Github, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme/ThemeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // This would be connected to the OAuth provider in a real implementation
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logging out');
    setIsLoggedIn(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { name: 'Calculator', path: '/calculator', icon: <Calculator className="h-4 w-4 mr-1" /> },
    { name: 'ITR Filing', path: '/itr-filing', icon: <FileText className="h-4 w-4 mr-1" /> },
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
          
          <ThemeToggle />
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">My Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">My Tax Reports</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="rounded-full flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLogin('google')} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogin('github')} className="cursor-pointer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
        
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
            
            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 justify-start"
                  onClick={() => console.log('Navigate to profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={handleLogout}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="oauth" 
                  size="sm" 
                  className="mt-2 justify-start"
                  onClick={() => handleLogin('google')}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Login with Google
                </Button>
                <Button 
                  variant="oauth" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => handleLogin('github')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Login with GitHub
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
