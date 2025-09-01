import { AdminLayout } from '@/components/AdminLayout';
import { ProductsManagement } from '@/components/admin/ProductsManagement';

const Products = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 ">
      
        
        <ProductsManagement />
      </div>
    </AdminLayout>
  );
};

export default Products; 