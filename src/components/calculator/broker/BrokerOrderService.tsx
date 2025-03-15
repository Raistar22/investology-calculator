
import { toast } from 'sonner';
import { Stock, Order, OrderType, OrderDuration, Portfolio } from './types';

export const executeOrder = (
  order: Order, 
  portfolio: Portfolio, 
  balance: number, 
  updateBalance: (newBalance: number) => void,
  updatePortfolio: (newPortfolio: Portfolio) => void
): Order => {
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
    updateBalance(balance - transactionValue);
    
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
    updateBalance(balance + transactionValue);
    
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
  updatePortfolio(updatedPortfolio);
  
  return {
    ...order,
    status: 'executed' as const
  };
};

export const placeOrder = (
  stock: Stock, 
  action: 'buy' | 'sell', 
  quantity: number, 
  type: OrderType = 'market',
  price?: number, 
  duration: OrderDuration = 'day',
  executeOrderFn: (order: Order) => Order,
  updateOrders: (orderUpdater: (prevOrders: Order[]) => Order[]) => void
) => {
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
    executedOrder = executeOrderFn(newOrder);
    
    if (executedOrder.status === 'executed') {
      toast.success(`${action.toUpperCase()} order for ${quantity} ${stock.ticker} shares executed at ₹${stock.value}`);
    }
  } else {
    toast.success(`${type.toUpperCase()} ${action.toUpperCase()} order for ${quantity} ${stock.ticker} shares placed successfully`);
  }
  
  updateOrders(prevOrders => [executedOrder, ...prevOrders]);
  return executedOrder;
};
