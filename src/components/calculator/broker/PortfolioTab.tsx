
import React from 'react';
import { Portfolio } from './types';
import { formatCurrency, calculatePortfolioValue, calculateUnrealizedPL } from './utils';

interface PortfolioTabProps {
  portfolio: Portfolio;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ portfolio }) => {
  const portfolioValue = calculatePortfolioValue(portfolio);
  const unrealizedPL = calculateUnrealizedPL(portfolio);
  
  return (
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
  );
};

export default PortfolioTab;
