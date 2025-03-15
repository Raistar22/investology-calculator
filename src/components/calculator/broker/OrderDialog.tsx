
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Clock, AlertTriangle } from "lucide-react";
import { Order, OrderType, OrderDuration, Stock } from './BrokerService';
import { toast } from 'sonner';

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  onPlaceOrder: (
    stock: Stock, 
    action: 'buy' | 'sell', 
    quantity: number, 
    type: OrderType, 
    price?: number, 
    duration?: OrderDuration
  ) => void;
  availableBalance: number;
  portfolio: {[ticker: string]: {quantity: number, avgPrice: number, currentPrice: number}};
}

const OrderDialog = ({ 
  isOpen, 
  onClose, 
  stock, 
  onPlaceOrder,
  availableBalance,
  portfolio
}: OrderDialogProps) => {
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [limitPrice, setLimitPrice] = useState<number | undefined>(undefined);
  const [stopPrice, setStopPrice] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<OrderDuration>('day');

  if (!stock) return null;

  const resetForm = () => {
    setAction('buy');
    setQuantity(1);
    setOrderType('market');
    setLimitPrice(undefined);
    setStopPrice(undefined);
    setDuration('day');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    if (orderType === 'limit' && !limitPrice) {
      toast.error('Limit price is required');
      return;
    }
    
    if (orderType === 'stop' && !stopPrice) {
      toast.error('Stop price is required');
      return;
    }
    
    if (orderType === 'stop-limit' && (!stopPrice || !limitPrice)) {
      toast.error('Both stop and limit prices are required');
      return;
    }
    
    // Check if enough cash for buy order
    if (action === 'buy') {
      const totalCost = quantity * (orderType === 'market' ? stock.value : (limitPrice || stock.value));
      if (totalCost > availableBalance) {
        toast.error('Insufficient funds for this transaction');
        return;
      }
    }
    
    // Check if enough shares for sell order
    if (action === 'sell') {
      const availableShares = portfolio[stock.ticker]?.quantity || 0;
      if (quantity > availableShares) {
        toast.error(`You only have ${availableShares} shares available to sell`);
        return;
      }
    }
    
    // Place the order
    onPlaceOrder(stock, action, quantity, orderType, 
      orderType === 'market' ? undefined : (
        orderType === 'limit' ? limitPrice : 
        orderType === 'stop' ? stopPrice :
        limitPrice // stop-limit uses limitPrice
      ),
      duration
    );
    
    handleClose();
  };

  // Calculate total order value
  const totalValue = quantity * (
    orderType === 'market' ? stock.value : 
    orderType === 'limit' ? (limitPrice || stock.value) :
    orderType === 'stop' ? (stopPrice || stock.value) :
    (limitPrice || stock.value) // stop-limit
  );

  // Get current position for this stock if selling
  const currentPosition = portfolio[stock.ticker];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Place Order: {stock.name} ({stock.ticker})
          </DialogTitle>
          <DialogDescription>
            Current Price: ₹{stock.value.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Action Buttons (Buy/Sell) */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              className={`flex-1 ${action === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-muted'}`}
              onClick={() => setAction('buy')}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Buy
            </Button>
            <Button
              type="button"
              className={`flex-1 ${action === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'bg-muted'}`}
              onClick={() => setAction('sell')}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Sell
            </Button>
          </div>
          
          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
            {action === 'sell' && currentPosition && (
              <p className="text-xs text-muted-foreground">
                Available: {currentPosition.quantity} shares
              </p>
            )}
          </div>
          
          {/* Order Type */}
          <div className="space-y-2">
            <Label>Order Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                type="button"
                variant={orderType === 'market' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOrderType('market')}
              >
                Market
              </Button>
              <Button
                type="button"
                variant={orderType === 'limit' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOrderType('limit')}
              >
                Limit
              </Button>
              <Button
                type="button"
                variant={orderType === 'stop' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOrderType('stop')}
              >
                Stop
              </Button>
              <Button
                type="button"
                variant={orderType === 'stop-limit' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOrderType('stop-limit')}
              >
                Stop-Limit
              </Button>
            </div>
          </div>
          
          {/* Price fields based on order type */}
          {(orderType === 'limit' || orderType === 'stop-limit') && (
            <div className="space-y-2">
              <Label htmlFor="limitPrice">Limit Price (₹)</Label>
              <Input
                id="limitPrice"
                type="number"
                step="0.01"
                min="0.01"
                value={limitPrice || ''}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || undefined)}
                required
              />
            </div>
          )}
          
          {(orderType === 'stop' || orderType === 'stop-limit') && (
            <div className="space-y-2">
              <Label htmlFor="stopPrice">Stop Price (₹)</Label>
              <Input
                id="stopPrice"
                type="number"
                step="0.01"
                min="0.01"
                value={stopPrice || ''}
                onChange={(e) => setStopPrice(parseFloat(e.target.value) || undefined)}
                required
              />
            </div>
          )}
          
          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                type="button"
                variant={duration === 'day' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setDuration('day')}
              >
                Day
              </Button>
              <Button
                type="button"
                variant={duration === 'gtc' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setDuration('gtc')}
              >
                GTC
              </Button>
              <Button
                type="button"
                variant={duration === 'ioc' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setDuration('ioc')}
              >
                IOC
              </Button>
              <Button
                type="button"
                variant={duration === 'fok' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setDuration('fok')}
              >
                FOK
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" /> 
              {duration === 'day' ? 'Day Only: Valid until market close' : 
               duration === 'gtc' ? 'Good Till Cancelled: Valid until explicitly cancelled' :
               duration === 'ioc' ? 'Immediate or Cancel: Execute immediately or cancel' :
               'Fill or Kill: Execute fully immediately or cancel'}
            </p>
          </div>
          
          {/* Order summary */}
          <div className="rounded-md bg-muted/50 p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Order Type:</span>
              <span className="font-medium capitalize">{orderType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantity:</span>
              <span className="font-medium">{quantity} shares</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Total:</span>
              <span className="font-bold">
                ₹{totalValue.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
          
          {/* Warning message */}
          <div className="text-sm text-muted-foreground flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
            <span>
              Market orders execute at the current market price, which may differ from the last traded price.
            </span>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={action === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
            >
              {action === 'buy' ? 'Buy' : 'Sell'} {stock.ticker}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
