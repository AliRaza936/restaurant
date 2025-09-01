import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Calendar,
  Filter
} from 'lucide-react';
import { Order, orderStatuses, paymentStatuses } from '@/data/admin';
import { OrderDetailsPage } from './OrderDetailsPage';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '@/store/order/orderSlice';
import { AppDispatch, RootState } from '@/store/store';
import { toast } from 'sonner';
import RoleGuard from '@/hooks/roleGaurd';

type ViewMode = 'list' | 'details';
type TimeFilter = '1hour' | '1week' | '1month' | '6months' | '1year' | 'all';

const OrdersManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders: reduxOrders } = useSelector((state: RootState) => state.orders);
  console.log(reduxOrders)
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  // Transform backend orders to frontend Order interface
  const transformedOrders = reduxOrders.map(backendOrder => {
    const orderDate = new Date(backendOrder.created_at);
    
    return {
      id: backendOrder.id,
      customerName: backendOrder.name,
      customerEmail: '', // Not available in backend
      customerPhone: backendOrder.phone,
      items: backendOrder.items.map((item: any) => ({
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      total: backendOrder.total_amount || 0,
      status: backendOrder.status as Order['status'],
      orderDate: orderDate,
      deliveryAddress: `${backendOrder.street_address}, ${backendOrder.city}, ${backendOrder.postal_code}`,
      paymentMethod: backendOrder.payment_method as Order['paymentMethod'],
      paymentStatus: 'paid' // Default to paid, adjust based on actual data
    } as Order;
  });

  // Apply time filter to orders
  const timeFilteredOrders = useMemo(() => {
    const now = new Date();
    
    switch (timeFilter) {
      case '1hour':
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        return transformedOrders.filter(order => order.orderDate >= oneHourAgo);
      case '1week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transformedOrders.filter(order => order.orderDate >= oneWeekAgo);
      case '1month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return transformedOrders.filter(order => order.orderDate >= oneMonthAgo);
      case '6months':
        const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        return transformedOrders.filter(order => order.orderDate >= sixMonthsAgo);
      case '1year':
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return transformedOrders.filter(order => order.orderDate >= oneYearAgo);
      default:
        return transformedOrders;
    }
  }, [transformedOrders, timeFilter]);

  // Apply search and status filters
  const filteredOrders = timeFilteredOrders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

const handleStatusChange = (orderId: string, newStatus: string) => {
  dispatch(updateOrderStatus({ id: orderId, status: newStatus }) as any)
    .unwrap()
    .then(() => {
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    })
    .catch((err) => {
      toast.error(`Failed to update order #${orderId}: ${err}`);
    });
};

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedOrderId('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case '1hour': return 'Last 1 Hour';
      case '1week': return 'Last 1 Week';
      case '1month': return 'Last 1 Month';
      case '6months': return 'Last 6 Months';
      case '1year': return 'Last 1 Year';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  const getTimeFilterCount = (filter: TimeFilter) => {
    const now = new Date();
    let count = 0;
    
    switch (filter) {
      case '1hour':
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        count = transformedOrders.filter(order => order.orderDate >= oneHourAgo).length;
        break;
      case '1week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        count = transformedOrders.filter(order => order.orderDate >= oneWeekAgo).length;
        break;
      case '1month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        count = transformedOrders.filter(order => order.orderDate >= oneMonthAgo).length;
        break;
      case '6months':
        const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        count = transformedOrders.filter(order => order.orderDate >= sixMonthsAgo).length;
        break;
      case '1year':
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        count = transformedOrders.filter(order => order.orderDate >= oneYearAgo).length;
        break;
      default:
        count = transformedOrders.length;
    }
    
    return count;
  };

  // Show Order Details Page
  if (viewMode === 'details') {
    return (
      <OrderDetailsPage
        orderId={selectedOrderId}
        onBack={handleBackToList}
        onStatusUpdate={handleStatusChange}
      />
    );
  }

  // Main list view
 

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders Management</h1>
        <p className="text-muted-foreground">
          View and manage customer orders, update statuses, and track deliveries.
        </p>
      </div>

      {/* Time Filter Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Time Filter
          </CardTitle>
          <CardDescription>
            Filter orders by time period to focus on specific timeframes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['1hour', '1week', '1month', '6months', '1year', 'all'] as TimeFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {getTimeFilterLabel(filter)}
                <Badge variant="secondary" className="ml-1">
                  {getTimeFilterCount(filter)}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Status Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by customer name, email, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
             {formatCurrency(
  (filteredOrders && filteredOrders.length > 0)
    ? filteredOrders.reduce(
        (sum, order) => sum + Number(order?.total || 0),
        0
      )
    : 0
)}

              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredOrders.filter(order => order.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredOrders.filter(order => order.status === 'delivered').length}
              </div>
              <div className="text-sm text-muted-foreground">Delivered Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.orderDate)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Customer Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Customer Details</h4>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Delivery Address</h4>
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Order Items</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Payment Method</h4>
                    <p className="text-sm capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Update Status:</span>
                
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'All' || timeFilter !== 'all'
                  ? 'Try adjusting your search, filter, or time criteria.'
                  : 'No orders have been placed yet.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { OrdersManagement }; 