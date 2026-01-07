
import React from 'react';
import { FileText, Download, Eye, Calendar, User, Trash2 } from 'lucide-react';
import { Bill } from '../types';

interface HistoryProps {
  bills: Bill[];
  onDeleteBill: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ bills, onDeleteBill }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Billing History</h2>
        <p className="text-slate-500">View and manage past sales transactions</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((bill) => (
          <div key={bill.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{bill.id}</h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100 uppercase">Paid</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {bill.customerName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(bill.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-0.5">Grand Total</p>
                  <p className="text-xl font-bold text-indigo-600">₹{bill.total.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button title="View Details" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button title="Download PDF" className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Delete this invoice record? This cannot be undone.')) {
                        onDeleteBill(bill.id);
                      }
                    }}
                    className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
              {bill.items.map((item, idx) => (
                <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100 font-medium">
                  {item.name} x{item.quantity}
                </span>
              ))}
            </div>
          </div>
        ))}

        {bills.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-900 font-bold">No Transaction History</h3>
            <p className="text-slate-500 text-sm">Create your first bill to see history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
