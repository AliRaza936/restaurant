import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, Package, Loader2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCat } from '@/store/category/categorySlice';
import { createProduct } from '@/store/product/productSlice';
import { toast } from 'sonner';
import RoleGuard from '@/hooks/roleGaurd';

interface AddProductPageProps {
  onBack: () => void;
  onProductAdded?: (product: any) => void;
}

const AddProductPage = ({ onBack, onProductAdded }: AddProductPageProps) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: '',
     price: '',
    image: '',
    featured: false,
  });

  // Variant Mode: "size" or "pieces"
  const [variantMode, setVariantMode] = useState<'size' | 'pieces' | null>(null);

  // Variants (multiple size/pieces with prices)
  const [variants, setVariants] = useState<{ value: string; price: string }[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories as any[]);

  useEffect(() => {
    (dispatch(getCat()) as any).unwrap().catch(() => {});
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setProduct({ ...product, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setProduct({ ...product, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addVariant = () => {
    setVariants([...variants, { value: '', price: '' }]);
  };

  const updateVariant = (index: number, field: 'value' | 'price', newValue: string) => {
    const updated = [...variants];
    updated[index][field] = newValue;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.categoryId) {
  toast.error('Name and category are required');
  return;
}

if (!variantMode && !product.price) {
  toast.error('Either base price or at least one variant is required');
  return;
}

if (variantMode && variants.length === 0) {
  toast.error('At least one variant is required when variant mode is selected');
  return;
}
  if (!imageFile) { // ✅ check for image upload
    toast.error('Product image is required');
    return;
  }


    const form = new FormData();
    form.append('name', product.name);
    form.append('description', product.description);
    form.append('categoryId', product.categoryId);
    form.append('isFeatured', product.featured.toString());
    form.append('variantMode', variantMode || ''); // backend knows if it's size or pieces
    form.append('variants', JSON.stringify(variants)); // send all variants
form.append('price', product.price || ''); 
    if (imageFile) form.append('image', imageFile);

    try {
      setIsSubmitting(true);
      const response = await (dispatch(createProduct(form)) as any).unwrap();
      toast.success('Product created successfully');
      onProductAdded && onProductAdded(response?.result);
      onBack();
    } catch (err) {
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className='text-white' onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your menu.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </CardTitle>
            <CardDescription>Fill in the product information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    placeholder="e.g.Pizza, Burger"
                    required
                  />
                </div>
                 <div className="space-y-2">
    <Label htmlFor="price">Base Price *</Label>
    <Input
      id="price"
      type="number"
      value={product.price}
      onChange={(e) => setProduct({ ...product, price: e.target.value })}
      placeholder="e.g., 500"
      required={!variantMode}
    />
  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={product.categoryId} onValueChange={(value) => setProduct({ ...product, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={3}
                  required
                />
              </div>
             

              {/* Variant Mode */}
              <div className="space-y-2">
                <Label>Variants *</Label>
                <Select value={variantMode || ''} onValueChange={(value: 'size' | 'pieces') => setVariantMode(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose variant type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">By Size (Small/Medium/Large)</SelectItem>
                    <SelectItem value="pieces">By Pieces (2pc/4pc/8pc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Variant Inputs */}
              {variantMode && (
                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={variantMode === 'size' ? "e.g. Small" : "e.g. 2"}
                        value={variant.value}
                        type={variantMode === 'size'?'text':'number'}
                        onChange={(e) => updateVariant(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        className="w-32"
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeVariant(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addVariant} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add {variantMode}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image or provide an image URL below
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={product.featured}
                  onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                  Cancel
                </Button>
                <RoleGuard allowedRoles={['admin']}>
                   <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Product
                </Button>
                </RoleGuard>
               
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Product Preview</CardTitle>
            <CardDescription>How your product will appear to customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
                {imagePreview || product.image ? (
                  <div className="relative h-full">
                    <img src={imagePreview || product.image} alt="Product preview" className="w-full h-full object-cover" />
                    {imagePreview && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeImage}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Upload className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Product Info Preview */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name || 'Product Name'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description || 'Product description will appear here...'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {variants.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{variantMode === 'size' ? v.value : `${v.value} pcs`}</span>
                      <span className="font-semibold">{v.price ? formatCurrency(parseFloat(v.price)) : 'PKR 0'}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {product.categoryId && (
                      <Badge variant="outline">{
                        (categories || []).find((c: any) => c.id === product.categoryId)?.name || 'Category'
                      }</Badge>
                    )}
                    {product.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { AddProductPage };
