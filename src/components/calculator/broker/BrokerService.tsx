
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  ShoppingCart,
  BarChart2,
  Briefcase,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BrokerServiceProps {
  availableBalance?: number;
}

export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';
export type OrderDuration = 'day' | 'gtc' | 'ioc' | 'fok';

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  value: number;
  change: number;
  changePercent: number;
  history?: number[];
}

export interface Order {
  id: string;
  stockId: string;
  ticker: string;
  type: OrderType;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  limitPrice?: number;
  stopPrice?: number;
  duration: OrderDuration;
  status: 'pending' | 'executed' | 'cancelled' | 'rejected';
  timestamp: Date;
}

const BrokerService: React.FC<BrokerServiceProps> = ({ availableBalance = 100000 }) => {
  const [balance, setBalance] = useState<number>(availableBalance);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'orders' | 'portfolio'>('portfolio');
  const [orders, setOrders] = useState<Order[]>([]);
  const [portfolio, setPortfolio] = useState<{[ticker: string]: {quantity: number, avgPrice: number, currentPrice: number}}>(
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
  
  // Simulating order execution
  const executeOrder = (order: Order) => {
    // Clone the portfolio for updates
    const updatedPortfolio = {...portfolio};
    
    // Calculate transaction value
    const transactionValue = order.quantity * order.price;
    
    if (order.action === 'buy') {
      // Check if enough balance
      if (transactionValue > balance) {
        toast.error('Insufficient funds to execute this order');
        return {
          ...order,
          status: 'rejected'
        };
      }
      
      // Update balance
      setBalance(prevBalance => prevBalance - transactionValue);
      
      // Update portfolio
      if (updatedPortfolio[order.ticker]) {
        const currentHolding = updatedPortfolio[order.ticker];
        const totalShares = currentHolding.quantity + order.quantity;
        const totalValue = (currentHolding.quantity * currentHolding.avgPrice) + transactionValue;
        updatedPortfolio[order.ticker] = {
          quantity: totalShares,
          avgPrice: totalValue / totalShares,
          currentPrice: order.price
        };
      } else {
        updatedPortfolio[order.ticker] = {
          quantity: order.quantity,
          avgPrice: order.price,
          currentPrice: order.price
        };
      }
    } else if (order.action === 'sell') {
      // Check if enough shares in portfolio
      if (!updatedPortfolio[order.ticker] || updatedPortfolio[order.ticker].quantity < order.quantity) {
        toast.error(`Not enough ${order.ticker} shares in portfolio`);
        return {
          ...order,
          status: 'rejected'
        };
      }
      
      // Update balance
      setBalance(prevBalance => prevBalance + transactionValue);
      
      // Update portfolio
      const currentHolding = updatedPortfolio[order.ticker];
      const remainingShares = currentHolding.quantity - order.quantity;
      
      if (remainingShares > 0) {
        updatedPortfolio[order.ticker] = {
          ...currentHolding,
          quantity: remainingShares,
          currentPrice: order.price
        };
      } else {
        delete updatedPortfolio[order.ticker];
      }
    }
    
    // Update portfolio state
    setPortfolio(updatedPortfolio);
    
    return {
      ...order,
      status: 'executed' as const // Use a type assertion to ensure type safety
    };
  };
  
  const placeOrder = (stock: Stock, action: 'buy' | 'sell', quantity: number, type: OrderType = 'market', price?: number, duration: OrderDuration = 'day') => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      stockId: stock.id,
      ticker: stock.ticker,
      type,
      action,
      quantity,
      price: type === 'market' ? stock.value : (price || stock.value),
      duration,
      status: 'pending',
      timestamp: new Date()
    };
    
    if (type === 'limit' || type === 'stop-limit') {
      newOrder.limitPrice = price;
    }
    
    if (type === 'stop' || type === 'stop-limit') {
      newOrder.stopPrice = price;
    }
    
    // For this demo, we'll execute market orders immediately
    let executedOrder = newOrder;
    if (type === 'market') {
      executedOrder = executeOrder(newOrder);
      
      if (executedOrder.status === 'executed') {
        toast.success(`${action.toUpperCase()} order for ${quantity} ${stock.ticker} shares executed at ₹${stock.value}`);
      }
    } else {
      toast.success(`${type.toUpperCase()} ${action.toUpperCase()} order for ${quantity} ${stock.ticker} shares placed successfully`);
    }
    
    setOrders(prevOrders => [executedOrder, ...prevOrders]);
    return executedOrder;
  };
  
  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId && order.status === 'pending'
          ? { ...order, status: 'cancelled' }
          : order
      )
    );
    toast.success('Order cancelled successfully');
  };
  
  const addToWatchlist = (stock: Stock) => {
    if (!watchlist.some(item => item.id === stock.id)) {
      setWatchlist(prevList => [...prevList, stock]);
      toast.success(`${stock.name} added to watchlist`);
    } else {
      toast.info(`${stock.name} is already in your watchlist`);
    }
  };
  
  const removeFromWatchlist = (stockId: string) => {
    setWatchlist(prevList => prevList.filter(stock => stock.id !== stockId));
    toast.success('Removed from watchlist');
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
  };
  
  // Calculate portfolio value
  const portfolioValue = Object.values(portfolio).reduce(
    (total, { quantity, currentPrice }) => total + quantity * currentPrice,
    0
  );
  
  // Calculate unrealized profit/loss
  const unrealizedPL = Object.entries(portfolio).reduce(
    (total, [_, { quantity, avgPrice, currentPrice }]) => 
      total + quantity * (currentPrice - avgPrice),
    0
  );

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
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-muted-foreground">Portfolio Value</p>
                <h4 className="text-2xl font-bold">{formatCurrency(portfolioValue)}</h4>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-muted-foreground">Unrealized P&L</p>
                <h4 className={`text-2xl font-bold ${unrealizedPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(unrealizedPL)} ({(unrealizedPL / (portfolioValue - unrealizedPL) * 100).toFixed(2)}%)
                </h4>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Stock</th>
                    <th className="text-right p-2">Quantity</th>
                    <th className="text-right p-2">Avg Price</th>
                    <th className="text-right p-2">Current Price</th>
                    <th className="text-right p-2">Total Value</th>
                    <th className="text-right p-2">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(portfolio).map(([ticker, data]) => {
                    const value = data.quantity * data.currentPrice;
                    const pl = data.quantity * (data.currentPrice - data.avgPrice);
                    const plPercentage = ((data.currentPrice - data.avgPrice) / data.avgPrice) * 100;
                    
                    return (
                      <tr key={ticker} className="border-b">
                        <td className="p-2 font-medium">{ticker}</td>
                        <td className="p-2 text-right">{data.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(data.avgPrice)}</td>
                        <td className="p-2 text-right">{formatCurrency(data.currentPrice)}</td>
                        <td className="p-2 text-right">{formatCurrency(value)}</td>
                        <td className="p-2 text-right">
                          <div className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatCurrency(pl)} ({plPercentage.toFixed(2)}%)
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Stock</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-right p-2">Quantity</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-right p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="p-2">
                          {order.timestamp.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-2 font-medium">{order.ticker}</td>
                        <td className="p-2 capitalize">
                          <span className={order.action === 'buy' ? 'text-green-500' : 'text-red-500'}>
                            {order.action} {order.type}
                          </span>
                        </td>
                        <td className="p-2 text-right">{order.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(order.price)}</td>
                        <td className="p-2 text-right">{formatCurrency(order.quantity * order.price)}</td>
                        <td className="p-2 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            order.status === 'executed' && "bg-green-100 text-green-800",
                            order.status === 'pending' && "bg-yellow-100 text-yellow-800",
                            order.status === 'cancelled' && "bg-gray-100 text-gray-800",
                            order.status === 'rejected' && "bg-red-100 text-red-800",
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {order.status === 'pending' && (
                            <Button variant="outline" size="sm" onClick={() => cancelOrder(order.id)}>
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-muted-foreground">
                        No orders found. Place an order from the Market Overview section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlist.map(stock => (
                  <div key={stock.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold">{stock.name}</h4>
                        <p className="text-sm text-muted-foreground">{stock.ticker}</p>
                      </div>
                      <div className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        <div className="text-xl font-bold">{formatCurrency(stock.value)}</div>
                        <div className="text-sm flex items-center justify-end">
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-500"
                        onClick={() => placeOrder(stock, 'buy', 1)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" /> Buy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => removeFromWatchlist(stock.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Your watchlist is empty. Add stocks from the Market Overview section.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { BrokerService };
export type { Stock as BrokerStock };
