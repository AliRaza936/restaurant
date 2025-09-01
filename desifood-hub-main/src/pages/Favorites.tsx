import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeFromFavorites } from '@/store/favoritesSlice'
import { addToCart } from '@/store/cartSlice'
import { ProductModal } from '@/components/ProductModal'
import { Product } from '@/data/products'
import { toast } from 'sonner';
import Footer from '@/components/Footer';

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { items: favoriteItems, count } = useAppSelector(state => state.favorites);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleRemoveFromFavorites = (productId: string) => {
    dispatch(removeFromFavorites(productId));
  };
const handleAddToCart = (product: any) => {
  // If product has variants, open modal
 
  
 setSelectedProduct(product as Product);
 setIsProductModalOpen(true)

  // Otherwise add directly like ProductModal does
  // const itemToAdd: CartItemWithVariations = {
  //   id: product.id,
  //   name: product.name,
  //   price: product.price,   // since no variant, use base price
  //   image: product.image,
  //   quantity: 1,
  //   size: undefined,
  //   pieces: undefined,
  // };

  // dispatch(addToCart(itemToAdd));

  // toast.success(`${product.name} added to cart!`);
};

 
  const getDisplayPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      if (product.variants.length === 1) {
        return `₨${product.variants[0].price}`;
      } else {
        const prices = product.variants.map((v) => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return `₨${minPrice} - ₨${maxPrice}`;
      }
    }
    return `₨${product.price}`;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 ">
  <div className="p-4 mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {count} items
        </Badge>
      </div>
    </div>

    {favoriteItems.length === 0 ? (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">Start adding your favorite dishes to see them here!</p>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Browse Menu
            </Button>
          </Link>
        </CardContent>
      </Card>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems.map((product) => (
          <Card
            key={product.id}
            className="border-0 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer flex flex-col"
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 sm:h-56 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-2 left-2 bg-orange-500 text-white flex items-center gap-1 px-2 py-1 text-xs rounded">
                <Star className="w-3 h-3" />
                Favorite
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFavorites(product.id);
                }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <CardHeader className="px-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{product.name}</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs py-1 px-2">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 flex flex-col justify-between flex-1">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xl sm:text-2xl font-bold text-orange-600">
                  {getDisplayPrice(product)}
                </span>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>

  {/* Product Detail Modal */}
  <ProductModal
    product={selectedProduct}
    isOpen={isProductModalOpen}
    onClose={() => {
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    }}
  />
  <br />
  <Footer/>
</div>

  )
}
