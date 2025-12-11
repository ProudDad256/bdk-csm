import React from 'react';
import { db } from '../services/mockDb';
import { AlertTriangle, Package, RefreshCw } from 'lucide-react';

const Inventory: React.FC = () => {
  const inventory = db.getInventory();

  const getStatusColor = (current: number, threshold: number) => {
    if (current === 0) return 'bg-red-100 text-red-700';
    if (current <= threshold) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (current: number, threshold: number) => {
    if (current === 0) return 'Out of Stock';
    if (current <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-green-700" /> Inventory Management
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <RefreshCw size={16} /> Sync Stock
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Item Name</th>
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Current Stock</th>
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Unit</th>
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Last Updated</th>
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 font-semibold text-gray-700">{item.quantity.toFixed(1)}</td>
                  <td className="p-4 text-gray-500 text-sm">{item.unit}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.quantity, item.threshold)} border-opacity-20 flex items-center w-fit gap-1`}>
                       {item.quantity <= item.threshold && <AlertTriangle size={12} />}
                       {getStatusText(item.quantity, item.threshold)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{item.lastUpdated}</td>
                  <td className="p-4">
                    <button className="text-green-700 hover:text-green-800 text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;