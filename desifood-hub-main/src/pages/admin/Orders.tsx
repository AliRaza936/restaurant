import { AdminLayout } from '@/components/AdminLayout';
import { OrdersManagement } from '@/components/admin/OrdersManagement';

const Orders = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
       
        
        <OrdersManagement />
      </div>
    </AdminLayout>
  );
};

export default Orders; 