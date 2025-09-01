import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart, Package, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  getSalesData,
  getDashboardStats,
  getTopProducts,
  getTopCategories,
  getOrderStats
} from '@/store/analytics/analyticsSlice';
import { AppDispatch, RootState } from '@/store/store';

interface SalesDataItem {
  date: string;
  orders: number;
  revenue: number;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

interface TopCategory {
  product_name: string;
  total_quantity: number;
}

interface OrderStat {
  status: string;
  count: number;
}

const Analytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('revenue');
  
  const analyticsState = useSelector((state: RootState) => state.analytics);
  const {
    salesData = [],
    dashboardStats = null,
    topProducts = [],
    topCategories = [],
    orderStats = [],
    loading = false
  } = analyticsState;

  useEffect(() => {
    dispatch(getSalesData(timeRange));
    dispatch(getDashboardStats());
    dispatch(getTopProducts(10));
    dispatch(getTopCategories(10));
    dispatch(getOrderStats());
  }, [dispatch, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRevenueChartData = () => ({
    labels: salesData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: salesData.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  const getOrdersChartData = () => ({
    labels: salesData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Orders',
        data: salesData.map(item => item.orders),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  const getCombinedChartData = () => ({
    labels: salesData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: salesData.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Orders',
        data: salesData.map(item => item.orders),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (PKR)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  // Get recent period data for growth calculation
  const recentData = salesData.slice(-7);
  const previousData = salesData.slice(-14, -7);
  
  const recentRevenue = recentData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const previousRevenue = previousData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const revenueGrowth = calculateGrowth(recentRevenue, previousRevenue);
  
  const recentOrders = recentData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const previousOrders = previousData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const ordersGrowth = calculateGrowth(recentOrders, previousOrders);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Analytics & Reports</h1>
              <p className="text-muted-foreground">
                Loading analytics data...
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Detailed insights into your business performance and trends.
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 1 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats ? formatCurrency(dashboardStats.totalRevenue || 0) : 'PKR 0'}
              </div>
              <div className="flex items-center text-xs">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingUp className="mr-1 h-3 w-3 text-red-600 transform rotate-180" />
                )}
                <span className={revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats ? dashboardStats.totalOrders || 0 : 0}
              </div>
              <div className="flex items-center text-xs">
                {ordersGrowth >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingUp className="mr-1 h-3 w-3 text-red-600 transform rotate-180" />
                )}
                <span className={ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats ? dashboardStats.pendingOrders || 0 : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Orders awaiting processing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats ? formatCurrency(dashboardStats.todayRevenue || 0) : 'PKR 0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats ? dashboardStats.todayOrders || 0 : 0} orders today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Daily revenue over time</CardDescription>
                </div>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="combined">Combined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {salesData && salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData.map(item => ({
                        date: formatDate(item.date),
                        revenue: item.revenue,
                        orders: item.orders
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'revenue') {
                            return [formatCurrency(Number(value)), 'Revenue'];
                          }
                          return [value, 'Orders'];
                        }}
                      />
                      {chartType === 'revenue' && (
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      {chartType === 'orders' && (
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      {chartType === 'combined' && (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available for selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Most ordered items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts && topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={product.product_name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{product.product_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.total_quantity} orders
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No product data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topCategories && topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <div key={category.product_name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category.product_name}</h4>
                      <div className="text-sm font-medium">
                        {category.total_quantity}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${topCategories.length > 0 ? (category.total_quantity / Math.max(...topCategories.map(cat => cat.total_quantity))) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-4">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current status of all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orderStats && orderStats.length > 0 ? (
                orderStats.map((status) => (
                  <div key={status.status} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{status.status}</h4>
                      <div className="text-sm font-medium">
                        {status.count}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${orderStats.length > 0 ? (status.count / Math.max(...orderStats.map(s => s.count))) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-4">
                  No order status data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;