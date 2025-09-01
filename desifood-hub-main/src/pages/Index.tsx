import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { products, Product } from '@/data/products';
import Footer from '@/components/Footer';


const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);


  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter(product => product.featured);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Auto-select "All" category when searching
    if (query && selectedCategory !== 'All') {
      setSelectedCategory('All');
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
        
        {/* Hero Section - only show when no search query */}
        {!searchQuery && <Hero />}
        
        <main className="container mx-auto px-4 py-8">
          {/* Featured Products Section */}
          {!searchQuery && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                Featured Dishes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Search Results Header */}
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Search results for "{searchQuery}"
              </h2>
              <p className="text-muted-foreground">
                Found {filteredProducts.length} item(s)
              </p>
            </div>
          )}

          {/* Products Grid */}
          <section>
            {!searchQuery && (
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                All Products
              </h2>
            )}
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {searchQuery 
                    ? `No products found for "${searchQuery}"`
                    : `No products found in ${selectedCategory}`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
        />
        <Footer />
      </div>
    );
  };

export default Index;
