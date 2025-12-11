import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, Coffee } from 'lucide-react';
import { db } from '../services/mockDb';
import { CartItem, MenuItem, OrderStatus } from '../types';

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const menu = db.getMenu();
  const categories = ['All', ...Array.from(new Set(menu.map(item => item.category)))];

  const filteredMenu = menu.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      db.addOrder({
        id: `ORD-${Date.now()}`,
        customerName: 'Walk-in Customer', // Simplified
        tableNumber: 'T-05',
        items: [...cart],
        totalAmount: calculateTotal(),
        status: OrderStatus.PENDING,
        timestamp: new Date(),
        staffId: '2'
      });
      setCart([]);
      setIsProcessing(false);
      alert('Order placed successfully!');
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Menu Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search and Filter */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenu.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
              onClick={() => addToCart(item)}
            >
              <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-gray-800">
                  UGX {item.price.toLocaleString()}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{item.category}</p>
                <div className="mt-auto pt-2 border-t border-gray-50 flex items-center text-green-700 font-medium text-sm">
                  <Plus size={16} className="mr-1" /> Add to Order
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Current Order
          </h2>
          <p className="text-xs text-gray-500 mt-1">Order #OD-1244</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Coffee size={48} className="mb-4 opacity-50" />
              <p>No items in cart</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-semibold text-green-700">
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 px-1 py-0.5">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="flex justify-between mb-2 text-gray-600 text-sm">
            <span>Subtotal</span>
            <span>UGX {calculateTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600 text-sm">
            <span>Tax (0%)</span>
            <span>UGX 0</span>
          </div>
          <div className="flex justify-between mb-6 text-xl font-bold text-gray-900 border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>UGX {calculateTotal().toLocaleString()}</span>
          </div>
          <button 
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all ${
              cart.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl'
            }`}
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;