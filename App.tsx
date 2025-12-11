import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  ChefHat, 
  Package, 
  Users, 
  BarChart3, 
  LogOut,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Kitchen from './components/Kitchen';
import Inventory from './components/Inventory';
import { UserRole, ViewState } from './types';
import { db } from './services/mockDb';

// Simple Login Component
const Login: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-700 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-green-600/30">
            <Utensils className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BDK Cafeteria</h1>
          <p className="text-gray-500 mt-2">Management System Portal</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center mb-4">Select Role to Login</p>
          <button 
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group border border-transparent hover:border-gray-200"
          >
            <div className="bg-green-100 text-green-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
               <Users size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Full Access</p>
            </div>
          </button>

          <button 
            onClick={() => onLogin(UserRole.CASHIER)}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group border border-transparent hover:border-gray-200"
          >
            <div className="bg-yellow-100 text-yellow-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
               <Utensils size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-800">Waitstaff / POS</p>
              <p className="text-xs text-gray-500">Order Management</p>
            </div>
          </button>

          <button 
            onClick={() => onLogin(UserRole.KITCHEN)}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group border border-transparent hover:border-gray-200"
          >
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
               <ChefHat size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-800">Kitchen Display</p>
              <p className="text-xs text-gray-500">Order Processing</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Sidebar Nav Item Helper
const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-green-700 text-white shadow-lg shadow-green-700/20' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="font-medium">{label}</span>
  </button>
);

// Main App Component
const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set default view based on role
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.KITCHEN) setView('KITCHEN');
    else if (role === UserRole.CASHIER) setView('POS');
    else setView('DASHBOARD');
  };

  if (!userRole) return <Login onLogin={handleLogin} />;

  // Navigation Config
  const canAccessDashboard = [UserRole.ADMIN].includes(userRole);
  const canAccessPOS = [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER].includes(userRole);
  const canAccessKitchen = [UserRole.ADMIN, UserRole.KITCHEN].includes(userRole);
  const canAccessInventory = [UserRole.ADMIN].includes(userRole);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="bg-green-700 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Utensils size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">BDK Cafeteria</h1>
              <p className="text-xs text-gray-500">CMS v1.0</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden ml-auto text-gray-500">
                <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {canAccessDashboard && (
              <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                active={view === 'DASHBOARD'} 
                onClick={() => setView('DASHBOARD')} 
              />
            )}
            {canAccessPOS && (
              <NavItem 
                icon={Utensils} 
                label="Point of Sale" 
                active={view === 'POS'} 
                onClick={() => setView('POS')} 
              />
            )}
            {canAccessKitchen && (
              <NavItem 
                icon={ChefHat} 
                label="Kitchen Display" 
                active={view === 'KITCHEN'} 
                onClick={() => setView('KITCHEN')} 
              />
            )}
            {canAccessInventory && (
              <NavItem 
                icon={Package} 
                label="Inventory" 
                active={view === 'INVENTORY'} 
                onClick={() => setView('INVENTORY')} 
              />
            )}
            {canAccessDashboard && (
              <NavItem 
                icon={BarChart3} 
                label="Reports" 
                active={view === 'REPORTS'} 
                onClick={() => setView('REPORTS')} 
              />
            )}
          </nav>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
              <img src="https://picsum.photos/100/100?random=10" alt="User" className="w-10 h-10 rounded-full border border-gray-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">{userRole}</p>
              </div>
            </div>
            <button 
              onClick={() => setUserRole(null)}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
           <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600">
              <MenuIcon size={24} />
           </button>
           <span className="font-bold text-gray-800">BDK CMS</span>
           <div className="w-6"></div> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {view === 'DASHBOARD' && <Dashboard />}
            {view === 'POS' && <POS />}
            {view === 'KITCHEN' && <Kitchen />}
            {view === 'INVENTORY' && <Inventory />}
            
            {(view === 'REPORTS' || view === 'MENU' || view === 'STAFF') && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                 <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <BarChart3 className="text-gray-400" size={48} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-800 mb-2">Module Under Development</h2>
                 <p className="text-gray-500 max-w-md">
                   The {view.toLowerCase()} module is outlined in the project scope but currently uses the shared database structure. Full UI implementation coming in the next sprint.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;