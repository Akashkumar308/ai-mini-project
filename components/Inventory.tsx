
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateStock, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'General',
    price: 0,
    stock: 0,
    minThreshold: 5,
    gstRate: 18
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    onAddProduct({
      ...newProduct as Product,
      id: Math.random().toString(36).substr(2, 9)
    });
    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'General', price: 0, stock: 0, minThreshold: 5, gstRate: 18 });
  };

  const handleUpdateStock = () => {
    if (editingStockId) {
      onUpdateStock(editingStockId, newStockValue);
      setEditingStockId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 underline decoration-indigo-500/30">Stock Management</h2>
          <p className="text-slate-600 font-medium">Add, track, update, or remove your spare parts inventory</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Spare Part
        </button>
      </header>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by part name..."
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Part Info</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">GST%</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">
                      <Package className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{product.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-wider">ID: {product.id.slice(-4).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-white border-2 border-slate-200 text-slate-700 text-xs font-black rounded-lg uppercase tracking-tight">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-slate-900 text-right">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-5 text-slate-600 font-bold text-center">{product.gstRate}%</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-black ${
                      product.stock <= product.minThreshold ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {product.stock}
                    </span>
                    {product.stock <= product.minThreshold ? (
                      <div className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                         LOW
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-5 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => {
                      setEditingStockId(product.id);
                      setNewStockValue(product.stock);
                    }}
                    className="flex items-center gap-2 font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Qty
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(`Are you sure you want to delete ${product.name}?`)) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStockId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Update Stock Quantity</h3>
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-500">Updating stock for: <span className="text-slate-900">{products.find(p => p.id === editingStockId)?.name}</span></p>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Quantity</label>
                <input 
                  type="number"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xl font-black text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setEditingStockId(null)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStock}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                >
                  Save Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-slate-900">Add New Spare Part</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Royal Enfield Brake Lever"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <input 
                  type="text"
                  placeholder="e.g. Braking"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Unit Price (₹)</label>
                <input 
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Initial Stock</label>
                <input 
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">GST Rate (%)</label>
                <select 
                  value={newProduct.gstRate}
                  onChange={(e) => setNewProduct({...newProduct, gstRate: parseInt(e.target.value) || 0})}
                  className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none"
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 shadow-xl transition-all"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
