
import { Portfolio } from './types';

export const formatCurrency = (value: number) => {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });
};

export const calculatePortfolioValue = (portfolio: Portfolio): number => {
  return Object.values(portfolio).reduce(
    (total, { quantity, currentPrice }) => total + quantity * currentPrice,
    0
  );
};

export const calculateUnrealizedPL = (portfolio: Portfolio): number => {
  return Object.entries(portfolio).reduce(
    (total, [_, { quantity, avgPrice, currentPrice }]) => 
      total + quantity * (currentPrice - avgPrice),
    0
  );
};
