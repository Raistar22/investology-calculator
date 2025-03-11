import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  BarChart4
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for stock indices
const mockIndices = [
  {
    id: 'sensex',
    name: 'SENSEX',
    value: 74250.78,
    change: 245.86,
    changePercent: 0.33,
    history: [74005, 74125, 74220, 74180, 74110, 74250.78],
  },
  {
    id: 'nifty',
    name: 'NIFTY 50',
    value: 22571.40,
    change: 69.35,
    changePercent: 0.31,
    history: [22502, 22530, 22565, 22545, 22510, 22571.40],
  },
  {
    id: 'banknifty',
    name: 'BANK NIFTY',
    value: 48125.65,
    change: -54.20,
    changePercent: -0.11,
    history: [48180, 48120, 48080, 48150, 48100, 48125.65],
  },
  {
    id: 'midcap',
    name: 'NIFTY MIDCAP',
    value: 14768.90,
    change: 102.45,
    changePercent: 0.70,
    history: [14666, 14695, 14720, 14755, 14740, 14768.90],
  }
];

// Mock data for stocks
const mockStocks = [
  {
    id: 'reliance',
    name: 'Reliance',
    ticker: 'RELIANCE',
    value: 2945.75,
    change: 32.80,
    changePercent: 1.13,
    history: [2913, 2920, 2935, 2950, 2940, 2945.75],
  },
  {
    id: 'tcs',
    name: 'TCS',
    ticker: 'TCS',
    value: 3872.15,
    change: -18.60,
    changePercent: -0.48,
    history: [3890, 3880, 3865, 3870, 3875, 3872.15],
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    ticker: 'HDFCBANK',
    value: 1625.25,
    change: 12.30,
    changePercent: 0.76,
    history: [1613, 1618, 1620, 1615, 1622, 1625.25],
  },
  {
    id: 'infosys',
    name: 'Infosys',
    ticker: 'INFY',
    value: 1482.55,
    change: -8.45,
    changePercent: -0.57,
    history: [1491, 1485, 1480, 1478, 1481, 1482.55],
  },
  {
    id: 'itc',
    name: 'ITC',
    ticker: 'ITC',
    value: 428.90,
    change: 3.15,
    changePercent: 0.74,
    history: [425.75, 426.50, 427.20, 428.35, 428.10, 428.90],
  },
  {
    id: 'bajaj',
    name: 'Bajaj Finance',
    ticker: 'BAJFINANCE',
    value: 6980.40,
    change: 28.75,
    changePercent: 0.41,
    history: [6951.65, 6960.20, 6970.50, 6965.30, 6975.80, 6980.40],
  }
];

type StockData = {
  id: string;
  name: string;
  ticker?: string;
  value: number;
  change: number;
  changePercent: number;
  history: number[];
};

const StockMarketData = () => {
  const [indices, setIndices] = useState<StockData[]>(mockIndices);
  const [stocks, setStocks] = useState<StockData[]>(mockStocks);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Update with small random changes to simulate real-time data
      const updatedIndices = indices.map(index => {
        const changeValue = (Math.random() * 20 - 10).toFixed(2);
        const newValue = (index.value + parseFloat(changeValue)).toFixed(2);
        const percentChange = ((parseFloat(changeValue) / index.value) * 100).toFixed(2);
        
        return {
          ...index,
          value: parseFloat(newValue),
          change: parseFloat(changeValue),
          changePercent: parseFloat(percentChange),
          history: [...index.history.slice(1), parseFloat(newValue)]
        };
      });
      
      const updatedStocks = stocks.map(stock => {
        const changeValue = (Math.random() * 15 - 7.5).toFixed(2);
        const newValue = (stock.value + parseFloat(changeValue)).toFixed(2);
        const percentChange = ((parseFloat(changeValue) / stock.value) * 100).toFixed(2);
        
        return {
          ...stock,
          value: parseFloat(newValue),
          change: parseFloat(changeValue),
          changePercent: parseFloat(percentChange),
          history: [...stock.history.slice(1), parseFloat(newValue)]
        };
      });
      
      setIndices(updatedIndices);
      setStocks(updatedStocks);
      setLastUpdated(new Date());
      setIsLoading(false);
      toast.success("Market data refreshed");
    }, 800);
  };
  
  useEffect(() => {
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(refreshData, 30000);
    
    return () => clearInterval(intervalId);
  }, [indices, stocks]);
  
  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStock(null);
  };

  const renderMiniChart = (history: number[]) => {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min;
    const width = 80;
    const height = 24;
    
    return (
      <svg width={width} height={height} className="ml-auto">
        <polyline
          points={history.map((value, index) => {
            const x = (index / (history.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={history[history.length - 1] >= history[0] ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-xl p-6 glass">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold">Market Overview</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Market Indices */}
        <div>
          <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-primary" />
            Market Indices
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indices.map((index) => (
              <Card key={index.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold">{index.name}</h5>
                      <p className="text-xl font-bold mt-1">
                        {index.value.toLocaleString('en-IN', { 
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {index.change >= 0 ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      )}
                      <span className="font-medium">
                        {index.changePercent >= 0 ? '+' : ''}
                        {index.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    {renderMiniChart(index.history)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Stocks Section */}
        <div>
          <h4 className="text-lg font-medium mb-3">Top Stocks</h4>
          <div className="overflow-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Company</th>
                  <th className="text-right p-2 font-medium">Price</th>
                  <th className="text-right p-2 font-medium">Change</th>
                  <th className="text-right p-2 font-medium">Chart</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr 
                    key={stock.id} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleStockClick(stock)}
                  >
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">{stock.ticker}</div>
                      </div>
                    </td>
                    <td className="text-right p-2 font-medium">
                      ₹{stock.value.toLocaleString('en-IN', { 
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2 
                      })}
                    </td>
                    <td className={`text-right p-2 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end">
                        {stock.change >= 0 ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {stock.change >= 0 ? '+' : ''}
                          {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-2 w-24">
                      {renderMiniChart(stock.history)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Stocks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMarketData;
