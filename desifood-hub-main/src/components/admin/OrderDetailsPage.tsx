import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { Order, orderStatuses } from '@/data/admin';
import { useDispatch } from 'react-redux';
import { getOrderById, updateOrderStatus } from '@/store/order/orderSlice';
import { AppDispatch } from '@/store/store';
import { toast } from 'sonner';

interface OrderDetailsPageProps {
  orderId: string;
  onBack: () => void;
  onStatusUpdate: (orderId: string, newStatus: Order['status']) => void;
}

const OrderDetailsPage = ({ orderId, onBack, onStatusUpdate }: OrderDetailsPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Dispatch the getOrderById action
        const result = await dispatch(getOrderById(orderId) as any);
        
        if (result.payload && result.payload.result) {
          // Transform the backend order data to match our frontend Order interface
          const backendOrder = result.payload.result;
          const transformedOrder: Order = {
            id: backendOrder.id,
            customerName: backendOrder.name,
            customerEmail: '', // Not available in backend
            customerPhone: backendOrder.phone,
            deliveryAddress: `${backendOrder.street_address}, ${backendOrder.city}, ${backendOrder.postal_code}`,
            orderDate: new Date(backendOrder.created_at),
            status: backendOrder.status as Order['status'],
            paymentStatus: 'paid', // Default to paid, adjust based on actual data
            paymentMethod: backendOrder.payment_method as Order['paymentMethod'],
            total: backendOrder.total_amount || 0,
            items: backendOrder.items.map((item: any) => ({
              productName: item.product_name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price
            }))
          };
          
          setOrder(transformedOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, dispatch]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  const handleStatusChange = (orderId: string, newStatus: string) => {
  dispatch(updateOrderStatus({ id: orderId, status: newStatus }) as any)
    .unwrap()
    .then(() => {
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      setOrder((prev) =>
        prev ? { ...prev, status: newStatus as Order['status'] } : null
      );
    })
    .catch((err) => {
      toast.error(`Failed to update order #${orderId}: ${err}`);
    });
};
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading Order...</h1>
            <p className="text-muted-foreground">
              Fetching order details...
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading order information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className='text-white' onClick={onBack}>
            <ArrowLeft  className="h-4 w-4  text-white" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Not Found</h1>
            <p className="text-muted-foreground">
              The requested order could not be found.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
              <p className="text-muted-foreground">
                The order with ID {orderId} could not be found.
              </p>
              <Button onClick={onBack} className="mt-4">
                Back to Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

 return (
  <div className="space-y-6">
    {/* Back Button & Heading */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <Button variant="outline" size="icon" onClick={onBack} className="self-start">
        <ArrowLeft className="h-4 w-4 text-white" />
      </Button>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Order #{order.id}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Detailed view of customer order and delivery information.
        </p>
      </div>
    </div>

    {/* Main Layout */}
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Order Summary (take 2 cols on lg) */}
      <div className="md:col-span-2 space-y-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Responsive row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status}</span>
                </Badge>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
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
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Order placed on {formatDate(order.orderDate)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer & Payment Info */}
      <div className="space-y-6">
        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.customerPhone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.deliveryAddress}</p>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Method:</span>
              <span className="text-sm capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

};

export { OrderDetailsPage }; 