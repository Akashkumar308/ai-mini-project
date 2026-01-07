
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, AlertCircle, ShoppingBag, IndianRupee } from 'lucide-react';
import { Bill, Product } from '../types';

interface DashboardProps {
  bills: Bill[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ bills, products }) => {
  const totalSales = useMemo(() => bills.reduce((acc, b) => acc + b.total, 0), [bills]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock <= p.minThreshold).length, [products]);
  const totalItemsSold = useMemo(() => bills.reduce((acc, b) => acc + b.items.reduce((sum, i) => sum + i.quantity, 0), 0), [bills]);

  const salesByDate = useMemo(() => {
    const data: Record<string, number> = {};
    bills.forEach(bill => {
      const date = new Date(bill.date).toLocaleDateString();
      data[date] = (data[date] || 0) + bill.total;
    });
    return Object.entries(data).map(([name, total]) => ({ name, total }));
  }, [bills]);

  const stockByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    products.forEach(p => {
      data[p.category] = (data[p.category] || 0) + p.stock;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your business performance</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sales</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Items Sold</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalItemsSold}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock</p>
              <h3 className="text-2xl font-bold text-slate-900">{lowStockCount} Items</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Growth</p>
              <h3 className="text-2xl font-bold text-slate-900">+12.5%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold mb-6">Sales Trend (Daily)</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                />
                <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold mb-6">Inventory by Category</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stockByCategory.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
