
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Order } from './types';
import { formatCurrency } from './utils';

interface OrdersTabProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onCancelOrder }) => {
  return (
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
                      <Button variant="outline" size="sm" onClick={() => onCancelOrder(order.id)}>
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
  );
};

export default OrdersTab;
