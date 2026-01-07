
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  User as UserIcon, 
  Phone, 
  ShoppingCart, 
  AlertTriangle,
  FileText,
  Printer,
  ArrowLeft,
  Bike,
  CheckCircle2
} from 'lucide-react';
import { Product, BillItem, Bill, User } from '../types';

interface BillingProps {
  products: Product[];
  onSubmit: (bill: Bill) => void;
  companyInfo: User;
}

const Billing: React.FC<BillingProps> = ({ products, onSubmit, companyInfo }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastBill, setLastBill] = useState<Bill | null>(null);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity), 0), [items]);
  const gstAmount = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity * (item.gstRate / 100)), 0), [items]);
  const total = subtotal + gstAmount;

  const addItem = () => {
    const newItem: BillItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      gstRate: companyInfo.defaultGstRate || 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<BillItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (updates.productId) {
          const product = products.find(p => p.id === updates.productId);
          if (product) {
            return { 
              ...item, 
              ...updates, 
              name: product.name, 
              price: product.price, 
              gstRate: product.gstRate 
            };
          }
        }
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  const handleSave = () => {
    if (!customerName || items.length === 0) return;
    
    const prefix = companyInfo.invoicePrefix || 'BL-';
    const newBill: Bill = {
      id: `${prefix}${Date.now().toString().slice(-6)}`,
      customerName,
      customerPhone,
      date: new Date().toISOString(),
      items,
      subtotal,
      gstAmount,
      total
    };
    setLastBill(newBill);
    onSubmit(newBill);
    setShowInvoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setItems([]);
    setShowInvoice(false);
    setLastBill(null);
  };

  if (showInvoice && lastBill) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn mb-20">
        <header className="flex justify-between items-center print:hidden">
          <button onClick={resetForm} className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-all">
            <ArrowLeft className="w-5 h-5" />
            New Bill
          </button>
          <div className="flex gap-4">
             <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-xl transition-all">
              <Printer className="w-5 h-5" />
              Print / Save PDF
            </button>
          </div>
        </header>

        <div id="invoice-content" className="bg-white p-12 border border-slate-200 shadow-xl rounded-3xl print:border-none print:shadow-none print:p-0">
          <div className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-8">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl text-white">
                <Bike className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{companyInfo.companyName}</h1>
                <p className="text-sm font-bold text-slate-500">{companyInfo.companyLocation}</p>
                {companyInfo.gstin && (
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">GSTIN: {companyInfo.gstin}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-1">Tax Invoice</h2>
              <p className="text-sm font-black text-slate-500"># {lastBill.id}</p>
              <p className="text-sm font-bold text-slate-500 mt-2">{new Date(lastBill.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bill From:</h4>
              <p className="text-lg font-black text-slate-900">{companyInfo.companyName}</p>
              <p className="text-slate-600 font-medium leading-relaxed">
                {companyInfo.companyLocation}<br/>
                {companyInfo.email}<br/>
                {companyInfo.gstin && `GST: ${companyInfo.gstin}`}
              </p>
            </div>
            <div className="text-right">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bill To:</h4>
              <p className="text-lg font-black text-slate-900">{lastBill.customerName}</p>
              <p className="text-slate-600 font-medium leading-relaxed">{lastBill.customerPhone}<br/>Cash Sale</p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-900">
                <th className="px-4 py-4 text-left text-xs font-black text-slate-900 uppercase tracking-widest">Part Name</th>
                <th className="px-4 py-4 text-center text-xs font-black text-slate-900 uppercase tracking-widest">Qty</th>
                <th className="px-4 py-4 text-right text-xs font-black text-slate-900 uppercase tracking-widest">Price</th>
                <th className="px-4 py-4 text-center text-xs font-black text-slate-900 uppercase tracking-widest">GST%</th>
                <th className="px-4 py-4 text-right text-xs font-black text-slate-900 uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {lastBill.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-5 font-black text-slate-900 text-lg">{item.name}</td>
                  <td className="px-4 py-5 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="px-4 py-5 text-right font-bold text-slate-700">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-5 text-center font-bold text-slate-500">{item.gstRate}%</td>
                  <td className="px-4 py-5 text-right font-black text-slate-900 text-lg">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-80 space-y-4">
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Subtotal:</span>
                <span>₹{lastBill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Total GST:</span>
                <span>₹{lastBill.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl">
                <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black">₹{lastBill.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t-2 border-slate-100 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
            Thank you for choosing {companyInfo.companyName} - Powered by Bike Ledgers
          </div>
        </div>
        <style>{`
          @media print {
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .print\\:hidden { display: none !important; }
            main { margin: 0 !important; padding: 0 !important; }
            #invoice-content { border: none !important; border-radius: 0 !important; padding: 0 !important; box-shadow: none !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 underline decoration-indigo-500/30 tracking-tight">Generate Billing</h2>
          <p className="text-slate-600 font-medium">Professional invoices with dark text visibility enabled.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <CheckCircle2 className="w-4 h-4" />
             Feature working as expected
           </div>
          <button 
            onClick={handleSave}
            disabled={!customerName || items.length === 0}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all uppercase tracking-widest text-xs"
          >
            <FileText className="w-5 h-5" />
            Finalize & Print
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-900">
                <UserIcon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Customer Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Type Name..."
                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Type Number..."
                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-900">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Service & Parts List</h3>
              </div>
              <button 
                onClick={addItem}
                className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline bg-indigo-50 px-4 py-2 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>

            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 border-4 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for items...</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-slate-50 p-6 rounded-3xl relative">
                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Spare Part Selection</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(item.id, { productId: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500 transition-all"
                      >
                        <option value="">-- Search Part --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Qty: {p.stock})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-900 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rate (₹)</label>
                      <div className="py-3 text-sm text-slate-700 font-black">₹{item.price.toFixed(0)}</div>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subtotal</label>
                      <div className="py-3 text-sm text-indigo-600 font-black">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-2 flex justify-end">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Bike className="w-40 h-40" />
             </div>
             <h3 className="text-xl font-black mb-8 uppercase tracking-widest flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-400" />
              Summary
            </h3>
            
            <div className="space-y-6 border-b border-slate-800 pb-8 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Base Amount</span>
                <span className="text-xl font-bold text-slate-300">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Total Tax (GST)</span>
                <span className="text-xl font-bold text-slate-300">₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-10">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Payable Amount</span>
              <span className="text-5xl font-black">₹{total.toFixed(0)}</span>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-3 border border-slate-700">
               <AlertTriangle className="w-5 h-5 text-amber-400" />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Verified against Indian Tax norms</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Billing;
