import { Product } from '@/data/products';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { addToFavorites, removeFromFavorites } from '@/store/favoritesSlice';
import { motion } from 'framer-motion';

export const ProductCard = ({
  product,
  onClick,
  categories,
}: ProductCardProps & { categories: any[] }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites?.items || []);

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getDisplayPrice = () => {
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          category: getCategoryName(product.categoryId),
          description: product.description,
          variants: product.variants || [],
        })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.2 }}
      className="h-full"
    >
      <Card
        className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group relative h-full flex flex-col"
        onClick={() => onClick(product)}
      >
        <CardHeader className="p-0 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          {/* Favorite Icon */}
          <button
            onClick={handleFavorite}
            className={`
              absolute top-2 right-2 p-2 rounded-full shadow-md transition
              ${isFavorite ? 'bg-red-100' : 'bg-white/70 hover:bg-white'}
              lg:opacity-0 lg:group-hover:opacity-100
              opacity-100
            `}
          >
            <Heart
              className={`w-5 h-5 transition ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </button>

          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-food-secondary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-primary">
              {getDisplayPrice()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-muted-foreground bg-surface-container px-2 py-1 rounded">
              {getCategoryName(product?.categoryId)}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart(product));
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
