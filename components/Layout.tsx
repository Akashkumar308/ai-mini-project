
import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Package, 
  History, 
  Sparkles,
  Bike,
  LogOut,
  MapPin,
  Settings as SettingsIcon
} from 'lucide-react';
import { ViewType, User } from '../types';

interface LayoutProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, user, children }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing', label: 'New Billing', icon: ReceiptIndianRupee },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'history', label: 'History', icon: History },
    { id: 'ai', label: 'AI Advisor', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 print:hidden shadow-2xl">
        <div className="p-8 flex flex-col gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shrink-0">
              <Bike className="w-8 h-8 text-slate-900" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-black text-xl tracking-tighter leading-none truncate">{user.companyName.toUpperCase()}</h1>
              <p className="text-[10px] font-black text-indigo-400 mt-1 uppercase tracking-widest truncate flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {user.companyLocation}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-widest">AI Monitor</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Tracking <span className="text-indigo-300">Sales</span> & <span className="text-indigo-300">Stock</span> for {user.companyName}.
            </p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
