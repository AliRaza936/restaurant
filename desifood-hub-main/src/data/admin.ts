export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: string;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  image: string;
  discountPercentage: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  applicableProducts: string[];
  minimumOrderAmount?: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Ahmed Khan',
    customerEmail: 'ahmed@email.com',
    customerPhone: '+92-300-1234567',
    items: [
      { productId: '1', productName: 'Chicken Biryani', quantity: 2, price: 450, total: 900 },
      { productId: '15', productName: 'Desi Chai', quantity: 1, price: 60, total: 60 }
    ],
    total: 960,
    status: 'pending',
    orderDate: new Date('2024-01-15T10:30:00'),
    deliveryAddress: 'House 123, Street 45, Karachi',
    paymentMethod: 'cash',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD002',
    customerName: 'Fatima Ali',
    customerEmail: 'fatima@email.com',
    customerPhone: '+92-301-2345678',
    items: [
      { productId: '7', productName: 'Classic Burger', quantity: 1, price: 380, total: 380 },
      { productId: '12', productName: 'French Fries', quantity: 1, price: 150, total: 150 }
    ],
    total: 530,
    status: 'delivered',
    orderDate: new Date('2024-01-14T15:45:00'),
    deliveryAddress: 'Apartment 7B, Block 12, Lahore',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'DEAL001',
    title: 'Weekend Special',
    description: 'Get 20% off on all Desi Food items this weekend!',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
    discountPercentage: 20,
    isActive: true,
    startDate: new Date('2024-01-13'),
    endDate: new Date('2024-01-16'),
    applicableProducts: ['1', '2', '3', '4', '5', '6'],
    minimumOrderAmount: 500
  }
];

export const mockSalesData: SalesData[] = [
  { date: '2024-01-10', revenue: 12500, orders: 28 },
  { date: '2024-01-11', revenue: 15800, orders: 35 },
  { date: '2024-01-12', revenue: 14200, orders: 32 },
  { date: '2024-01-13', revenue: 18900, orders: 42 },
  { date: '2024-01-14', revenue: 16500, orders: 38 },
  { date: '2024-01-15', revenue: 21000, orders: 45 }
];

export const dashboardStats: DashboardStats = {
  totalOrders: 220,
  totalRevenue: 98500,
  pendingOrders: 8,
  todayOrders: 45,
  todayRevenue: 21000
};

export const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
] as const;

export const paymentMethods = ['cash', 'card', 'online'] as const;
export const paymentStatuses = ['pending', 'paid', 'failed'] as const;

// Export products for Analytics component
export { products } from './products'; 