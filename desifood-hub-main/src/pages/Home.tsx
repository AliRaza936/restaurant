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
import { toast } from 'sonner';
import { motion } from 'framer-motion';   
import Loader from '@/components/Loader';

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

  let { products, loading, error } = useSelector((state: any) => state.products);
  let categories = useSelector((state: any) => state.categories?.categories);

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

  if (error) {
    toast.error(error);
  }
  const [showEntryLoader, setShowEntryLoader] = useState(true);

  useEffect(() => {
    // random delay between 2000–3000ms
    const delay = Math.floor(Math.random() * 1000) + 2000;

    const timer = setTimeout(() => {
      setShowEntryLoader(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  if (showEntryLoader) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />

      {/* Hero with fade-in */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <Hero />
        </motion.div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Search Results */}
        {searchQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
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
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
              >
                {filteredProducts.map((product: any) => (
                  <motion.div
                    key={product.id}
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                  >
                    <ProductCard
                      product={product}
                      categories={categories}
                      onClick={handleProductClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Featured Products */}
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.2 },
                    },
                  }}
                >
                  {featuredProducts.map((product: any) => (
                    <motion.div
                      key={product.id}
                      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                    >
                      <ProductCard
                        product={product}
                        categories={categories}
                        onClick={handleProductClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>

            {/* Non-Featured Products */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                >
                  {filteredNonFeatured?.slice(0)?.reverse().map((product: any) => (
                    <motion.div
                      key={product.id}
                      variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
                    >
                      <ProductCard
                        product={product}
                        categories={categories}
                        onClick={handleProductClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
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
