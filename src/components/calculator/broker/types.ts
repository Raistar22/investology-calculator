
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

export interface PortfolioHolding {
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Portfolio {
  [ticker: string]: PortfolioHolding;
}
