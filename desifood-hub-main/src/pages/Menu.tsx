import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { products, Product } from '@/data/products';
import Footer from '@/components/Footer';

const Menu = () => {
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of authentic Pakistani dishes, from traditional favorites 
            to modern interpretations. Each dish is crafted with care using the finest ingredients.
          </p>
        </div>

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
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              {selectedCategory === 'All' ? 'All Dishes' : `${selectedCategory} Dishes`}
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

export default Menu; 