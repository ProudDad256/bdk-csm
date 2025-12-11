import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, AlertTriangle, ShoppingBag } from 'lucide-react';
import { db } from '../services/mockDb';

// Updated colors to match KU green theme
const COLORS = ['#15803d', '#ca8a04', '#1e293b', '#64748b']; // Green-700, Yellow-600, Slate-800, Slate-500

const Dashboard: React.FC = () => {
  const orders = db.getOrders();
  const inventory = db.getInventory();

  // Calculations
  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'COMPLETED').reduce((acc, curr) => acc + curr.totalAmount, 0), [orders]);
  const totalOrders = orders.length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);

  // Chart Data Preparation
  const dailySalesData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
       const date = order.timestamp.toLocaleDateString('en-US', { weekday: 'short' });
       if (order.status === 'COMPLETED') {
         data[date] = (data[date] || 0) + order.totalAmount;
       }
    });
    return Object.keys(data).map(day => ({ name: day, sales: data[day] }));
  }, [orders]);

  const categoryData = [
    { name: 'Mains', value: 45 },
    { name: 'Beverages', value: 30 },
    { name: 'Snacks', value: 25 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">UGX {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-green-100 text-green-700 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Staff</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Weekly Sales Performance
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`UGX ${Number(value).toLocaleString()}`, 'Sales']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-gray-600">{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;