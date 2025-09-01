import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tags,
  Package,
  AlertCircle
} from 'lucide-react';
import { categories, products } from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCategory, deleteCategory, getCat, updateCategory } from '@/store/category/categorySlice';
import { toast } from 'sonner';
import RoleGuard from '@/hooks/roleGaurd';
import { getAllProducts } from '@/store/product/productSlice';
// import moduleName from '../../store/category/categorySlice'

const CategoriesManagement = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [error, setError] = useState('');
  let dispatch = useAppDispatch()
  let [editId,setEditId] = useState('')

  // After normalization in slice, categories is an array
  let allCats = useAppSelector((state) => state.categories.categories as any[]) || []
  let products = useAppSelector((state) => state.products.products as any[]) || []


 const handleAddCategory = () => {
  if (!newCategoryName.trim()) {
    toast.error('Category name is required');
    return;
  }

  (dispatch(createCategory({ name: newCategoryName })) as any)
    .unwrap()
    .then((response) => {
      console.log(response);
       if(response.success == true){
         getAllCat()
        toast.success('Category created successfully');
        setNewCategoryName('');
      setError('');
      setIsAddDialogOpen(false)
      }else{
       toast.error(response.message)

      }
      
      
    })
   
    .catch((err) => {
      console.log(err)
      setError(err);
       toast.error(err)
    });
};


  const handleEditCategory = (id: string, oldName: string) => {
    setEditingCategory(oldName);
    setEditingCategoryName(oldName);
    setEditId(id)
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategoryName.trim()) {
    toast.error('Category name is required');
      
      return;
    } 

  (dispatch(updateCategory({ id: editId, name: editingCategoryName })) as any)
    .unwrap()
    .then((response) => {
      console.log(response);
      if(response.success == true){
         getAllCat()
        toast.success('Category updated successfully');
        setNewCategoryName('');
        setError('');
        setIsAddDialogOpen(false)
        setEditingCategory(null)
      }else{
       toast.error(response.message)

      }
      
      
    })
   
    .catch((err) => {
      console.log(err)
      setError(err);
       toast.error(err)
    });
  };
console.log(allCats)
  const handleDeleteCategory = (id: string) => {
console.log(id)
    if (confirm(`Are you sure you want to delete the category ?`)) {
       (dispatch(deleteCategory(id)) as any)
    .unwrap()
    .then((response) => {
      console.log(response);
      if(response.success == true){
         getAllCat()
        toast.success('Category delete successfully');
        
    
      }else{
       toast.error(response.message)

      }

    })
 
    .catch((err) => {
      console.log(err)
      setError(err);
       toast.error(err)
    });
    }
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(product => product.categoryId == categoryId).length;
  };

  const getFeaturedProductCount = (categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId && product.isFeatured).length;
  };

  let getAllCat = ()=>{
  (dispatch(getCat()) as any)
    .unwrap()
    .then((response) => {
      console.log(response);
      
  
    })
    .catch((err) => {
      console.log(err)
           toast.error(err);
    });
  }
useEffect(()=>{
getAllCat()
dispatch(getAllProducts())
},[])
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories Management</h1>
          <p className="text-muted-foreground">
            Organize your menu by creating and managing product categories.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-white'>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your products.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="categoryName" className="text-sm font-medium text-white">
                  Category Name
                </label>
                <Input
                  id="categoryName"
                  className='text-white'
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Desi Food, Fast Food, Drinks"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                   {error && error.toString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button className='text-red-600' variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <RoleGuard allowedRoles={['admin']}>
                   <Button onClick={handleAddCategory}>
                Add Category
              </Button>
              </RoleGuard>
           
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(allCats) && allCats.map((category:any,i:number) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{category?.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category?.id,category?.name)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <RoleGuard allowedRoles={['admin']}>
                     <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category?.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  </RoleGuard>
                 
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Products:</span>
                  <Badge variant="secondary">
                    {getProductCount(category?.id)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Featured Products:</span>
                  <Badge variant="outline">
                    {getFeaturedProductCount(category?.id   )}
                  </Badge>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Array.isArray(allCats) && allCats.length > 0 ? (getProductCount(category?.name) / Math.max(...allCats.map((cat: any) => getProductCount(cat?.name)))) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getProductCount(category?.id)} products
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-white'>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category name.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="editCategoryName" className="text-sm font-medium text-white">
                  Category Name
                </label>
                <Input
                  id="editCategoryName"
                  className='text-white'
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline"  className = 'text-red-600' onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
                   <RoleGuard allowedRoles={['admin']}>
                   <Button onClick={handleUpdateCategory}>
                Update Category
              </Button>
              </RoleGuard>
           
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Empty State */}
      {allCats && allCats.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Tags className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">No categories yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first category to start organizing your products.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { CategoriesManagement }; 