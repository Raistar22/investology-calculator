
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Stock, Order, OrderType, OrderDuration, Portfolio } from './types';
import { formatCurrency } from './utils';
import PortfolioTab from './PortfolioTab';
import OrdersTab from './OrdersTab';
import WatchlistTab from './WatchlistTab';
import { executeOrder, placeOrder } from './BrokerOrderService';

interface BrokerServiceProps {
  availableBalance?: number;
}

const BrokerService: React.FC<BrokerServiceProps> = ({ availableBalance = 100000 }) => {
  const [balance, setBalance] = useState<number>(availableBalance);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'orders' | 'portfolio'>('portfolio');
  const [orders, setOrders] = useState<Order[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>(
    {
      'RELIANCE': { quantity: 10, avgPrice: 2920, currentPrice: 2945.75 },
      'TCS': { quantity: 5, avgPrice: 3885, currentPrice: 3872.15 },
      'HDFCBANK': { quantity: 20, avgPrice: 1618, currentPrice: 1625.25 },
    }
  );
  const [watchlist, setWatchlist] = useState<Stock[]>([
    {
      id: 'reliance',
      name: 'Reliance',
      ticker: 'RELIANCE',
      value: 2945.75,
      change: 32.80,
      changePercent: 1.13,
    },
    {
      id: 'tcs',
      name: 'TCS',
      ticker: 'TCS',
      value: 3872.15,
      change: -18.60,
      changePercent: -0.48,
    }
  ]);
  
  // Execute order with the current portfolio and balance
  const handleExecuteOrder = (order: Order): Order => {
    return executeOrder(
      order,
      portfolio,
      balance,
      setBalance,
      setPortfolio
    );
  };
  
  // Place order handling
  const handlePlaceOrder = (
    stock: Stock, 
    action: 'buy' | 'sell', 
    quantity: number, 
    type: OrderType = 'market', 
    price?: number, 
    duration: OrderDuration = 'day'
  ) => {
    return placeOrder(
      stock,
      action,
      quantity,
      type,
      price,
      duration,
      handleExecuteOrder,
      setOrders
    );
  };
  
  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId && order.status === 'pending'
          ? { ...order, status: 'cancelled' }
          : order
      )
    );
    toast.success('Order cancelled successfully');
  };
  
  const handleAddToWatchlist = (stock: Stock) => {
    if (!watchlist.some(item => item.id === stock.id)) {
      setWatchlist(prevList => [...prevList, stock]);
      toast.success(`${stock.name} added to watchlist`);
    } else {
      toast.info(`${stock.name} is already in your watchlist`);
    }
  };
  
  const handleRemoveFromWatchlist = (stockId: string) => {
    setWatchlist(prevList => prevList.filter(stock => stock.id !== stockId));
    toast.success('Removed from watchlist');
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="border-b p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-primary" />
          Broker Services
        </h3>
        <div className="flex gap-2 items-center">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="font-semibold">{formatCurrency(balance)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex border-b mb-4">
          <button
            className={cn(
              "px-4 py-2 font-medium",
              activeTab === 'portfolio' && "border-b-2 border-primary text-primary"
            )}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={cn(
              "px-4 py-2 font-medium",
              activeTab === 'orders' && "border-b-2 border-primary text-primary"
            )}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={cn(
              "px-4 py-2 font-medium",
              activeTab === 'watchlist' && "border-b-2 border-primary text-primary"
            )}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist
          </button>
        </div>
        
        {activeTab === 'portfolio' && (
          <PortfolioTab portfolio={portfolio} />
        )}
        
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} onCancelOrder={handleCancelOrder} />
        )}
        
        {activeTab === 'watchlist' && (
          <WatchlistTab 
            watchlist={watchlist} 
            onPlaceOrder={handlePlaceOrder} 
            onRemoveFromWatchlist={handleRemoveFromWatchlist} 
          />
        )}
      </div>
    </div>
  );
};

export { BrokerService };
export type { Stock as BrokerStock, Order, OrderType, OrderDuration, Portfolio };
