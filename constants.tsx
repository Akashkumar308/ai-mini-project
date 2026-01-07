
import { Product, Bill } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Engine Oil 1L (Syntix)', category: 'Lubricants', price: 850, stock: 25, minThreshold: 10, gstRate: 18 },
  { id: '2', name: 'Brake Pad Set (Front)', category: 'Braking', price: 320, stock: 15, minThreshold: 5, gstRate: 12 },
  { id: '3', name: 'Chain Sprocket Kit', category: 'Transmission', price: 1450, stock: 8, minThreshold: 5, gstRate: 18 },
  { id: '4', name: 'LED Headlamp Bulb', category: 'Electrical', price: 650, stock: 4, minThreshold: 10, gstRate: 28 },
  { id: '5', name: 'Side Mirror (Left)', category: 'Body', price: 180, stock: 30, minThreshold: 15, gstRate: 12 },
  { id: '6', name: 'Spark Plug (NGK)', category: 'Electrical', price: 120, stock: 50, minThreshold: 20, gstRate: 18 },
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'B-1001',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    date: '2024-05-15T10:30:00Z',
    items: [
      { id: 'itm1', productId: '1', name: 'Engine Oil 1L (Syntix)', quantity: 1, price: 850, gstRate: 18 }
    ],
    subtotal: 850,
    gstAmount: 153,
    total: 1003
  },
  {
    id: 'B-1002',
    customerName: 'Amit Patel',
    customerPhone: '9898989898',
    date: '2024-05-16T14:45:00Z',
    items: [
      { id: 'itm2', productId: '2', name: 'Brake Pad Set (Front)', quantity: 2, price: 320, gstRate: 12 },
      { id: 'itm3', productId: '6', name: 'Spark Plug (NGK)', quantity: 1, price: 120, gstRate: 18 }
    ],
    subtotal: 760,
    gstAmount: 98.4,
    total: 858.4
  }
];
