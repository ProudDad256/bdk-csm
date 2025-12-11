import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { Order, OrderStatus } from '../types';
import { CheckCircle, Clock, UtensilsCrossed, AlertCircle } from 'lucide-react';

const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulate real-time polling
  useEffect(() => {
    const fetchOrders = () => {
      const allOrders = db.getOrders();
      // Only show active kitchen orders
      const active = allOrders.filter(o => 
        o.status === OrderStatus.PENDING || 
        o.status === OrderStatus.PREPARING
      ).reverse(); // Oldest first for kitchen
      setOrders(active);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const advanceOrder = (id: string, currentStatus: OrderStatus) => {
    const nextStatus = currentStatus === OrderStatus.PENDING 
      ? OrderStatus.PREPARING 
      : OrderStatus.READY;
    
    db.updateOrderStatus(id, nextStatus);
    
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o).filter(o => o.status !== OrderStatus.READY));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UtensilsCrossed className="text-green-700" /> Kitchen Display System (KDS)
        </h2>
        <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 block"></span> Pending
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500 block"></span> Preparing
            </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-gray-100">
           <CheckCircle size={64} className="text-green-500 mb-4 opacity-50" />
           <p className="text-xl text-gray-500 font-medium">All caught up! No active orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`rounded-xl shadow-sm border-2 overflow-hidden flex flex-col ${
                order.status === OrderStatus.PENDING 
                  ? 'border-blue-100 bg-white' 
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className={`p-4 border-b flex justify-between items-center ${
                order.status === OrderStatus.PENDING ? 'bg-blue-50/50' : 'bg-yellow-100/50'
              }`}>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Table {order.tableNumber}</h3>
                  <p className="text-xs text-gray-500">#{order.id}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                  <Clock size={16} />
                  <span>{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>

              <div className="p-4 flex-1">
                <ul className="space-y-3">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="bg-gray-200 text-gray-800 font-bold w-6 h-6 flex items-center justify-center rounded text-xs mt-0.5">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-800 font-medium leading-tight">{item.name}</span>
                    </li>
                  ))}
                </ul>
                {order.status === OrderStatus.PENDING && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit">
                        <AlertCircle size={12} /> New Order
                    </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 bg-white/50 mt-auto">
                <button 
                  onClick={() => advanceOrder(order.id, order.status)}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    order.status === OrderStatus.PENDING
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {order.status === OrderStatus.PENDING ? 'Start Preparing' : 'Mark Ready'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;