
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import Inventory from './components/Inventory';
import History from './components/History';
import AiAssistant from './components/AiAssistant';
import Login from './components/Login';
import Settings from './components/Settings';
import { ViewType, Product, Bill, StockLog, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_BILLS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [stockHistory, setStockHistory] = useState<StockLog[]>([]);

  // Simulate persistent data load
  useEffect(() => {
    const saved = localStorage.getItem('bike_ledgers_users');
    if (saved) {
      setRegisteredUsers(JSON.parse(saved));
    }
  }, []);

  const handleRegister = (newUser: User) => {
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('bike_ledgers_users', JSON.stringify(updated));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    const updatedUsers = registeredUsers.map(u => u.email === updatedUser.email ? updatedUser : u);
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('bike_ledgers_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleResetPassword = (email: string) => {
    console.log(`Password reset requested for: ${email}`);
    // In a real app, this would call a backend service to send a reset token
  };

  if (!user) {
    return (
      <Login 
        onLogin={setUser} 
        onRegister={handleRegister} 
        onResetPassword={handleResetPassword}
        registeredUsers={registeredUsers} 
      />
    );
  }

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setStockHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      productId: newProduct.id,
      change: newProduct.stock,
      type: 'manual',
      date: new Date().toISOString()
    }, ...prev]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const change = newStock - p.stock;
        setStockHistory(prevLogs => [{
          id: Math.random().toString(36).substr(2, 9),
          productId,
          change,
          type: 'manual',
          date: new Date().toISOString()
        }, ...prevLogs]);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setStockHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      productId,
      change: 0,
      type: 'deletion',
      date: new Date().toISOString()
    }, ...prev]);
  };

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
  };

  const handleBillSubmit = (newBill: Bill) => {
    setBills(prev => [newBill, ...prev]);

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      const newStockLogs: StockLog[] = [];

      newBill.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            stock: updatedProducts[productIndex].stock - item.quantity
          };

          newStockLogs.push({
            id: Math.random().toString(36).substr(2, 9),
            productId: item.productId,
            change: -item.quantity,
            type: 'sale',
            date: new Date().toISOString()
          });
        }
      });

      setStockHistory(prevLogs => [...newStockLogs, ...prevLogs]);
      return updatedProducts;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard bills={bills} products={products} />;
      case 'billing':
        return <Billing products={products} onSubmit={handleBillSubmit} companyInfo={user} />;
      case 'inventory':
        return (
          <Inventory 
            products={products} 
            onAddProduct={handleAddProduct} 
            onUpdateStock={handleUpdateStock}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'history':
        return <History bills={bills} onDeleteBill={handleDeleteBill} />;
      case 'ai':
        return <AiAssistant products={products} bills={bills} stockHistory={stockHistory} user={user} />;
      case 'settings':
        return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      default:
        return <Dashboard bills={bills} products={products} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} user={user}>
      <div className="transition-all duration-300 ease-in-out">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
