
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, BarChart2 } from 'lucide-react';
import { Stock } from './types';
import { formatCurrency } from './utils';

interface WatchlistTabProps {
  watchlist: Stock[];
  onPlaceOrder: (stock: Stock, action: 'buy' | 'sell', quantity: number) => void;
  onRemoveFromWatchlist: (stockId: string) => void;
}

const WatchlistTab: React.FC<WatchlistTabProps> = ({ 
  watchlist, 
  onPlaceOrder, 
  onRemoveFromWatchlist 
}) => {
  return (
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
                  onClick={() => onPlaceOrder(stock, 'buy', 1)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" /> Buy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500"
                  onClick={() => onRemoveFromWatchlist(stock.id)}
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
  );
};

export default WatchlistTab;
