import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart, CartItem } from '@/store/cartSlice';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  categories?: { id: string; name: string }[];
}

export interface CartItemWithVariations extends CartItem {
  size?: string;
  pieces?: number;
}

export const ProductModal = ({ product, isOpen, onClose, categories }: ProductModalProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPieces, setSelectedPieces] = useState<number | null>(null);

  // ✅ set default variant selection when product changes
 useEffect(() => {
  if (!product) return;

  const sizeVariants = product.variants
    .filter(v => v.size)
    .sort((a, b) => a.price - b.price); // ✅ sort first

  const piecesVariants = product.variants
    .filter(v => v.pieces)
    .sort((a, b) => a.price - b.price); // ✅ sort first

  if (sizeVariants.length > 0) {
    setSelectedSize(sizeVariants[0].size); // ✅ pick cheapest one
    setSelectedPieces(null);
  } else if (piecesVariants.length > 0) {
    setSelectedPieces(piecesVariants[0].pieces); // ✅ pick cheapest one
    setSelectedSize(null);
  } else {
    setSelectedSize(null);
    setSelectedPieces(null);
  }

  setQuantity(1); // reset quantity when modal opens
}, [product]);


  if (!product) return null;

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getCurrentPrice = () => {
    let variant;

    if (selectedSize) {
      variant = product.variants.find(v => v.size === selectedSize);
    } else if (selectedPieces) {
      variant = product.variants.find(v => v.pieces === selectedPieces);
    }

    return variant ? variant.price : product.price;
  };

  const handleAddToCart = () => {
    const itemToAdd: CartItemWithVariations = {
      id: product.id,
      name: product.name,
      price: getCurrentPrice(),
      image: product.imageUrl,
      quantity,
      size: selectedSize || undefined,
      pieces: selectedPieces || undefined,
    };

    dispatch(addToCart(itemToAdd));
    onClose();
    toast.success('Item add to cart successfully')
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const getCurrentPriceDisplay = () => {
    const price = getCurrentPrice();
    return `₨${price * quantity}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-card border-border p-4 md:p-6 max-h-[90vh] overflow-y-auto pb-6">

  <DialogHeader className="">
  <DialogTitle className="text-xl sm:text-2xl font-bold text-card-foreground">
    {product.name}
  </DialogTitle>

  {/* Close Button */}
</DialogHeader>
  <Button
    variant="ghost"
    size="sm"
    onClick={onClose}
    className="p-1 text-white hover:bg-gray-600 rounded-full absolute right-3 top-2"
  >
    <X className="w-4 h-4" />
  </Button>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    {/* Product Image */}
    <div className="relative w-full">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-lg"
      />
      {product.isFeatured && (
        <Badge className="absolute top-2 left-2 bg-food-secondary text-primary-foreground">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}
    </div>

    {/* Product Details */}
    <div className="space-y-4">
      <div>
        <Badge variant="secondary" className="bg-surface-container text-muted-foreground mb-2">
          {getCategoryName(product.categoryId)}
        </Badge>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        {/* Size Selection */}
       {/* Size Selection */}
{product.variants.some(v => v.size) && (
  <div>
    <h3 className="font-medium text-card-foreground mb-2">Size:</h3>
    <div className="gap-2 text-white">
      {product.variants
        .filter(v => v.size)
        .sort((a, b) => a.price - b.price)   // ✅ sort by price ascending
        .map((variant) => (
          <Button
            key={variant.id}
            variant={selectedSize === variant.size ? 'default' : 'outline'}
            onClick={() => {
              setSelectedSize(variant.size);
              setSelectedPieces(null);
            }}
            className="flex-1 min-w-[70px] sm:min-w-[80px] mt-1"
            size="sm"
          >
            {variant.size} - ₨{variant.price}
          </Button>
        ))}
    </div>
  </div>
)}

{/* Pieces Selection */}
{product.variants.some(v => v.pieces) && (
  <div>
    <h3 className="font-medium text-card-foreground mb-2">Pieces:</h3>
    <div className="gap-2 text-white">
      {product.variants
        .filter(v => v.pieces)
        .sort((a, b) => a.price - b.price)   // ✅ sort by price ascending
        .map((variant) => (
          <Button
            key={variant.id}
            variant={selectedPieces === variant.pieces ? 'default' : 'outline'}
            onClick={() => {
              setSelectedPieces(variant.pieces);
              setSelectedSize(null);
            }}
            className="flex-1 mt-2 min-w-[70px] sm:min-w-[80px]"
            size="sm"
          >
            {variant.pieces} pcs - ₨{variant.price}
          </Button>
        ))}
    </div>
  </div>
)}

        {/* Quantity Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-medium text-card-foreground">Quantity:</span>
          <div className="flex items-center border border-border rounded-lg text-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-center min-w-[2rem]">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
          {getCurrentPriceDisplay()}
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-2 sm:py-3 transition-smooth shadow-primary"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  </div>
</DialogContent>

    </Dialog>
  );
};
