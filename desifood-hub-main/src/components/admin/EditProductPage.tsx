import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  X,
  Package,
  Loader2,
  Plus
} from 'lucide-react';
import { Product } from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCat } from '@/store/category/categorySlice';
import { updateProduct } from '@/store/product/productSlice';
import { toast } from 'sonner';
import RoleGuard from '@/hooks/roleGaurd';

interface EditProductPageProps {
  product: Product;
  onBack: () => void;
  onProductUpdated: (product: Product) => void;
}

const EditProductPage = ({ product, onBack, onProductUpdated }: EditProductPageProps) => {
  console.log(product)
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    categoryId: (product as any).categoryId,
    image: (product as any).imageUrl,
    isFeatured: (product as any).isFeatured === 1 || false
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories as any[]);

  // Variant Mode: "size" or "pieces"
  const [variantMode, setVariantMode] = useState<'size' | 'pieces' | null>(null);

  // Variants state
  const [variants, setVariants] = useState<{ value: string; price: string }[]>([]);

  // ---------------- HANDLERS ---------------- //
  const addVariant = () => {
    setVariants([...variants, { value: '', price: '' }]);
  };

  const updateVariant = (index: number, field: 'value' | 'price', value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

 useEffect(() => {
  setEditedProduct({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    categoryId: (product as any).categoryId,
    image: (product as any).imageUrl,
    isFeatured: (product as any).isFeatured === true || (product as any).isFeatured === 1 || false
  });

  setImagePreview(null);
  setImageFile(null);

  // Load categories
  (dispatch(getCat()) as any).unwrap().catch(() => {});

  // --- Initialize variants from product ---
  if (product.variants && product.variants.length > 0) {
    // detect mode: if first variant has "size" use size mode, else pieces
    const mode = product.variants[0].size ? "size" : "pieces";
    setVariantMode(mode);
const mapped = product.variants
  ?.map((v: any) => ({
    value: mode === "size" ? v.size : v.pieces?.toString(),
    price: v.price.toString(),
  }))
  .sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // ✅ ascending by price

setVariants(mapped);
  } else {
    setVariantMode(null);
    setVariants([]);
  }
}, [product]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setEditedProduct({ ...editedProduct, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setEditedProduct({ ...editedProduct, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editedProduct.name || !editedProduct.price || !(editedProduct as any).categoryId) {
    toast.error('Name, price, and category are required');
    return;
  }

  const form = new FormData();
  form.append('name', editedProduct.name);
  form.append('description', editedProduct.description);
  form.append('price', editedProduct.price);
  form.append('categoryId', (editedProduct as any).categoryId);
  form.append('isFeatured', (editedProduct.isFeatured ? '1' : '0'));

  // ✅ Properly map variants
  if (variants.length > 0 && variantMode) {
    form.append('variantMode', variantMode);

    const mappedVariants = variants.map(v => {
      if (variantMode === "size") {
        return { size: v.value, price: parseFloat(v.price) };
      } else {
        return { pieces: parseInt(v.value, 10), price: parseFloat(v.price) };
      }
    });

    form.append('variants', JSON.stringify(mappedVariants));
  }

  if (imageFile) form.append('image', imageFile);

  try {
    setIsSubmitting(true);
    const response = await (dispatch(updateProduct({ id: (product as any).id, formData: form })) as any).unwrap();
    toast.success('Product updated successfully');
    onProductUpdated(response?.result || product);
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

  // ---------------- UI ---------------- //
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className='text-white' onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Product</h1>
          <p className="text-muted-foreground">Update the product information.</p>
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
            <CardDescription>Update the product information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    placeholder="e.g.Pizza, Burger"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    placeholder="450"
                    required
                  />
                </div>
           
               
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={(editedProduct as any).categoryId} onValueChange={(value) => setEditedProduct({ ...editedProduct, categoryId: value })}>
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
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
                  {variants?.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={variantMode === 'size' ? "e.g. Small" : "e.g. 2"}
                        value={variant.value}
                        onChange={(e) => updateVariant(index, 'value', e.target.value)}
                         type={variantMode === 'size'?'text':'number'}
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                  disabled={isSubmitting}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={editedProduct.isFeatured}
                  onCheckedChange={(checked) => setEditedProduct({ ...editedProduct, isFeatured: checked })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                  Cancel
                </Button>
                <RoleGuard allowedRoles={['admin']}>
                   <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Product
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
                {imagePreview || editedProduct.image ? (
                  <div className="relative h-full">
                    <img
                      src={imagePreview || editedProduct.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
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
                  <h3 className="font-semibold text-lg">
                    {editedProduct.name || 'Product Name'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {editedProduct.description || 'Product description will appear here...'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(editedProduct as any).categoryId && (
                      <Badge variant="outline">{
                        (categories || []).find((c: any) => c.id === (editedProduct as any).categoryId)?.name || 'Category'
                      }</Badge>
                    )}
                    {editedProduct.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  {editedProduct.price && (
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(parseFloat(editedProduct.price))}
                    </span>
                  )}
                </div>

                {/* Preview Variants */}
                {variantMode && variants.length > 0 && (
                  <div className="space-y-1">
                    <Label className="font-medium">Available {variantMode === 'size' ? 'Sizes' : 'Pieces'}</Label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v, i) => (
                        <Badge key={i} variant="outline">
                          {variantMode === 'size' ? v.value : `${v.value} pcs`} - {formatCurrency(parseFloat(v.price))}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export {EditProductPage};
