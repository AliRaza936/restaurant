import { AdminLayout } from '@/components/AdminLayout';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';

const Categories = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
       
        
        <CategoriesManagement />
      </div>
    </AdminLayout>
  );
};

export default Categories; 