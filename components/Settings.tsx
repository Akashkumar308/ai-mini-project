
import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Mail, 
  Lock, 
  FileText, 
  Bell, 
  Save, 
  LogOut, 
  CheckCircle2,
  Percent,
  Hash
} from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState<User>({
    ...user,
    gstin: user.gstin || '',
    defaultGstRate: user.defaultGstRate || 18,
    invoicePrefix: user.invoicePrefix || 'INV-',
    lowStockAlertsEnabled: user.lowStockAlertsEnabled ?? true
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 underline decoration-indigo-500/30 tracking-tight">Business Settings</h2>
          <p className="text-slate-600 font-medium">Manage your company profile, tax details, and invoice preferences.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-emerald-600 font-black text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
            Settings Saved
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Company Information */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-900">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Company Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                placeholder="29AAAAA0000A1Z5"
                onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
                className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Location</label>
              <input
                type="text"
                value={formData.companyLocation}
                onChange={(e) => setFormData({...formData, companyLocation: e.target.value})}
                className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* GST & Invoice Settings */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-900">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Tax & Invoice Defaults</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Default GST Rate (%)</label>
              <select
                value={formData.defaultGstRate}
                onChange={(e) => setFormData({...formData, defaultGstRate: parseInt(e.target.value)})}
                className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
              >
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({...formData, invoicePrefix: e.target.value})}
                className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Security & Notifications */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-900">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Security & Notifications</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Login Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Update Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all"
                  placeholder="Leave blank to keep same"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="font-black text-slate-900 text-sm">Low Stock Alerts</p>
                  <p className="text-xs text-slate-500 font-medium">Get notified when spare parts fall below minimum levels.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.lowStockAlertsEnabled}
                  onChange={(e) => setFormData({...formData, lowStockAlertsEnabled: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl"
          >
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-red-100 transition-all border border-red-100"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
