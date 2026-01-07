
export interface User {
  email: string;
  password?: string;
  companyName: string;
  companyLocation: string;
  gstin?: string;
  defaultGstRate?: number;
  invoicePrefix?: string;
  lowStockAlertsEnabled?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  gstRate: number;
}

export interface BillItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface Bill {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
}

export interface StockLog {
  id: string;
  productId: string;
  change: number;
  type: 'sale' | 'purchase' | 'adjustment' | 'manual' | 'deletion';
  date: string;
}

export type ViewType = 'dashboard' | 'billing' | 'inventory' | 'history' | 'ai' | 'settings';
