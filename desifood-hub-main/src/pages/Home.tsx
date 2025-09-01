import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import Footer from '@/components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '@/store/product/productSlice';
import { getCat } from '@/store/category/categorySlice';

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl shadow-md bg-muted p-4 space-y-4">
    <div className="h-40 bg-gray-500 rounded-xl"></div>
    <div className="h-4 bg-gray-400 rounded w-3/4"></div>
    <div className="h-4 bg-gray-400 rounded w-1/2"></div>
  </div>
);

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState({
    name: 'All',
    value: 'All',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const dispatch = useDispatch();

  let { products,loading} = useSelector((state: any) => state.products);
  let categories = useSelector((state: any) => state.categories?.categories);
 // Filter products
  const filteredProducts = products.filter((product: any) => {
    const matchesCategory =
      selectedCategory.value === 'All' || product.categoryId === selectedCategory.value;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories.find((cat: any) => cat.id === product.categoryId)?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter((product: any) => product.isFeatured);
  const NofeaturedProducts = products.filter((product: any) => !product.isFeatured);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && selectedCategory.value !== 'All') {
      setSelectedCategory({ name: 'All', value: 'All' });
    }
  };

  const filteredNonFeatured = NofeaturedProducts.filter(
    (product: any) =>
      selectedCategory.value === 'All' || product.categoryId === selectedCategory.value
  );

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getCat());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />

      {!searchQuery && <Hero />}

      <main className="container mx-auto px-4 py-8">
        {/* Search Results */}
        {searchQuery ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Search results for "{searchQuery}"
              </h2>
              <p className="text-muted-foreground">
                Found {filteredProducts.length} item(s)
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No products found for "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categories={categories}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Featured Products */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                Featured Dishes
              </h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categories={categories}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Non-Featured Products */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                All Products
              </h2>

              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredNonFeatured.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    No products available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNonFeatured?.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categories={categories}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        categories={categories}
      />

      <Footer />
    </div>
  );
};

export default Home;
