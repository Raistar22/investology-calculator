
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Pause } from "lucide-react";
import { toast } from 'sonner';

interface StockActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {
    name: string;
    ticker: string;
    value: number;
    change: number;
    changePercent: number;
  } | null;
}

const StockActionDialog = ({ isOpen, onClose, stock }: StockActionDialogProps) => {
  if (!stock) return null;

  const handleAction = (action: 'buy' | 'sell' | 'hold') => {
    const actionMessages = {
      buy: `Initiated buy order for ${stock.name} at ₹${stock.value}`,
      sell: `Initiated sell order for ${stock.name} at ₹${stock.value}`,
      hold: `Added ${stock.name} to your watchlist`
    };

    toast.success(actionMessages[action]);
    onClose();
  };

  return (
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
              <Pause className="mr-2 h-4 w-4" />
              Hold
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockActionDialog;
