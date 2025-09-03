import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Package, DollarSign, TrendingUp, ShoppingCart, Badge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { formatDistanceToNow } from 'date-fns';
import { AppDispatch, RootState } from '@/store/store';
import { getAllOrders } from '@/store/order/orderSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };
  const API_URL = import.meta.env.VITE_API_URL;
   const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orders);
    console.log(orders)
     const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalFeatured: 0,
    totalVariants: 0
  });
  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/product/total`);
        console.log(data)
        if (data.success) {
          setProductStats(data.result);
        }
      } catch (error) {
        console.error('Error fetching product stats:', error);
      }
    };

    fetchProductStats();
  }, []);

    const dashboardStats = {
  totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
  totalOrders: orders.length,
  totalProducts: orders.reduce((sum, order) => sum + order.items.length, 0), // assuming items = products per order
  activeUsers: new Set(orders.map(o => o.user_id)).size, // unique users
};
  const stats = [
  {
    title: 'Total Revenue',
    value: formatCurrency(dashboardStats.totalRevenue),
   
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    title: 'Total Orders',
    value: dashboardStats.totalOrders.toString(),
    
    icon: ShoppingCart,
    color: 'text-blue-600'
  },
  
  {
    title: 'Active Users',
    value: dashboardStats.activeUsers.toString(),
  
    icon: Users,
    color: 'text-orange-600'
  }
];
  

 
  
  
    useEffect(() => {
      dispatch(getAllOrders());
    }, [dispatch]);
  
  
const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  return (
    <AdminLayout>
     <div className="space-y-6">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
      Dashboard
    </h1>
    <p className="text-muted-foreground text-sm sm:text-base">
      Welcome to your restaurant management dashboard. Here's an overview of your business.
    </p>
  </div>

  {/* Stats Grid */}
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat) => (
      <Card key={stat.title} className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
        </CardContent>
      </Card>
    ))}

    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        <Package className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{productStats.totalProducts}</div>
        <p className="text-xs text-muted-foreground">
          Featured: {productStats.totalFeatured} • Variants: {productStats.totalVariants}
        </p>
      </CardContent>
    </Card>
  </div>

  {/* Recent Orders */}
  <Card>
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>Latest customer orders and their status</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg"
          >
            {/* Left: Order Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">{order.id}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{order.name}</p>
              </div>
            </div>

            {/* Middle: Amount & Date */}
            <div className="text-left sm:text-right flex-1">
              <p className="font-medium text-sm sm:text-base">
                {order.items.length} items • {formatCurrency(Number(order.total_amount))}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="sm:ml-4">
              <span
                className={`${getStatusColor(order.status)} rounded-lg px-2 py-1 text-xs sm:text-sm`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  {/* Quick Actions */}
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <Link to={'/admin/products'}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Package className="h-5 w-5" />
            Add New Product
          </CardTitle>
          <CardDescription>Create a new menu item</CardDescription>
        </CardHeader>
      </Card>
    </Link>

    <Link to={'/admin/orders'}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <ShoppingCart className="h-5 w-5" />
            View Orders
          </CardTitle>
          <CardDescription>Check order status</CardDescription>
        </CardHeader>
      </Card>
    </Link>

    <Link to={'/admin/analytics'}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <BarChart3 className="h-5 w-5" />
            View Analytics
          </CardTitle>
          <CardDescription>Business insights</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  </div>
</div>

    </AdminLayout>
  );
};

export default Dashboard; 