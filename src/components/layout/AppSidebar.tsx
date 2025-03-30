
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calculator, LineChart, Briefcase, PiggyBank, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarLink = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  description: string;
};

const sidebarLinks: SidebarLink[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/',
    description: 'Main dashboard and overview'
  },
  {
    icon: Calculator,
    label: 'Calculator',
    path: '/calculator',
    description: 'Tax and investment calculator'
  },
  {
    icon: LineChart,
    label: 'Analytics',
    path: '/calculator#analytics',
    description: 'Financial analytics and projections'
  },
  {
    icon: Briefcase,
    label: 'Portfolio',
    path: '/calculator#portfolio',
    description: 'Manage your investment portfolio'
  },
  {
    icon: PiggyBank,
    label: 'Retirement',
    path: '/calculator#retirement',
    description: 'Retirement planning tools'
  },
  {
    icon: DollarSign,
    label: 'Tax Planner',
    path: '/calculator#tax-regime',
    description: 'Tax optimization strategies'
  }
];

export const AppSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      return location.pathname === route && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  return (
    <div
      className="fixed left-0 top-0 h-full z-50 flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover area */}
      <div className="w-2 h-full bg-transparent hover:bg-primary/10 transition-colors duration-500" />
      
      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r border-border shadow-lg h-full overflow-hidden transition-all duration-700 ease-in-out flex flex-col",
          isHovered ? "w-64" : "w-0"
        )}
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            TaxSmart Navigation
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group hover:bg-accent",
                    isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground"
                  )}
                >
                  <link.icon className={cn(
                    "h-5 w-5",
                    isActive(link.path) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex-1">
                    <div className="font-medium">{link.label}</div>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <p>TaxSmart v1.0</p>
          <p>© {new Date().getFullYear()} TaxSmart Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
