
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Pause, Eye } from "lucide-react";
import { toast } from 'sonner';
import OrderDialog from './broker/OrderDialog';
import { useState } from 'react';
import { OrderType, OrderDuration } from './broker/BrokerService';

interface StockActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {
    id: string;
    name: string;
    ticker: string;
    value: number;
    change: number;
    changePercent: number;
    history?: number[];
  } | null;
  onPlaceOrder?: (
    stock: any,
    action: 'buy' | 'sell',
    quantity: number,
    type: OrderType,
    price?: number,
    duration?: OrderDuration
  ) => void;
  onAddToWatchlist?: (stock: any) => void;
  availableBalance?: number;
  portfolio?: {[ticker: string]: {quantity: number, avgPrice: number, currentPrice: number}};
}

const StockActionDialog = ({ 
  isOpen, 
  onClose, 
  stock,
  onPlaceOrder,
  onAddToWatchlist,
  availableBalance = 100000,
  portfolio = {}
}: StockActionDialogProps) => {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderAction, setOrderAction] = useState<'buy' | 'sell'>('buy');
  
  if (!stock) return null;

  const handleAction = (action: 'buy' | 'sell' | 'hold') => {
    if (action === 'buy' || action === 'sell') {
      setOrderAction(action);
      setIsOrderDialogOpen(true);
    } else if (action === 'hold') {
      if (onAddToWatchlist) {
        onAddToWatchlist(stock);
      } else {
        toast.success(`Added ${stock.name} to your watchlist`);
      }
      onClose();
    }
  };

  const handlePlaceOrder = (
    stock: any,
    action: 'buy' | 'sell',
    quantity: number,
    type: OrderType,
    price?: number,
    duration?: OrderDuration
  ) => {
    if (onPlaceOrder) {
      onPlaceOrder(stock, action, quantity, type, price, duration);
    } else {
      const actionMessages = {
        buy: `Simulated buy order for ${quantity} ${stock.ticker} at ₹${stock.value}`,
        sell: `Simulated sell order for ${quantity} ${stock.ticker} at ₹${stock.value}`
      };
      toast.success(actionMessages[action]);
    }
    
    setIsOrderDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {stock.name} ({stock.ticker})
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="mb-6 space-y-2">
              <p className="text-2xl font-bold">
                ₹{stock.value.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
              <p className={`flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </p>
            </div>
            
            <div className="flex gap-4 justify-between">
              <Button
                onClick={() => handleAction('buy')}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Buy
              </Button>
              <Button
                onClick={() => handleAction('sell')}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Sell
              </Button>
              <Button
                onClick={() => handleAction('hold')}
                variant="outline"
                className="flex-1"
              >
                <Eye className="mr-2 h-4 w-4" />
                Watch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Order Dialog */}
      <OrderDialog
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        stock={stock}
        onPlaceOrder={handlePlaceOrder}
        availableBalance={availableBalance}
        portfolio={portfolio}
      />
    </>
  );
};

export default StockActionDialog;
