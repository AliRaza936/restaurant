import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Tag,
  // DollarSign,
 Layers ,
  FileText,
  Loader2
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '@/store/product/productSlice';
import { getCat } from '@/store/category/categorySlice';
import { toast } from 'sonner';
import { AddProductPage } from './AddProductPage';
import { EditProductPage } from './EditProductPage';
import RoleGuard from '@/hooks/roleGaurd';
import { reverse } from 'dns';

const ProductsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    getAllProductsData();
    getAllCategories();
  }, []);

  const getAllProductsData = () => {
    (dispatch(getAllProducts()) as any)
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const getAllCategories = () => {
    (dispatch(getCat()) as any)
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setViewMode('edit');
  };

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setDeleteLoadingId(productId);
        await (dispatch(deleteProduct(productId)) as any).unwrap();
        toast.success('Product deleted successfully');
        getAllProductsData();
      } catch (err) {
        toast.error(err);
      } finally {
        setDeleteLoadingId(null);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  if (viewMode === 'add') {
    return (
      <AddProductPage
        onBack={() => setViewMode('list')}
        onProductAdded={() => {
          getAllProductsData();
          setViewMode('list');
        }}
      />
    );
  }

  if (viewMode === 'edit' && editingProduct) {
    return (
      <EditProductPage
        product={editingProduct}
        onBack={() => setViewMode('list')}
        onProductUpdated={() => {
          getAllProductsData();
          setViewMode('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's menu items and products.
          </p>
        </div>
        <Button onClick={() => setViewMode('add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.slice(0)?.reverse()?.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {product.isFeatured === true && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <RoleGuard allowedRoles={['admin']}>
                       <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteLoadingId === product.id}
                    >
                      {deleteLoadingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                    </RoleGuard>
                   
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.imageUrl && (
                  <div className="w-full h-56 rounded-xl overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    
                     
                    <p className="text-foreground">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                    <Badge variant="outline">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                    <Badge variant="secondary">
                      Rs {parseFloat(product.price).toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {products?.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first product to start building your menu.
              </p>
              <Button onClick={() => setViewMode('add')}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export { ProductsManagement }; 