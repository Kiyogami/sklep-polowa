import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import HeroSection from '@/components/store/HeroSection';
import ProductCard from '@/components/store/ProductCard';
import { categories } from '@/data/mockData';
import { productsApi } from '@/services/api';
import { toast } from 'sonner';

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Handle hash navigation for categories
  useEffect(() => {
    if (location.hash) {
      const categoryFromHash = location.hash.replace('#', '');
      // Check if this category exists
      if (categories.some(c => c.id === categoryFromHash)) {
        setSelectedCategory(categoryFromHash);
        // Scroll to products section
        const element = document.getElementById('products');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Nie udało się pobrać produktów.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <section id="products" className="py-16">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                  Kolekcja
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  Nasze produkty
                </h2>
                <p className="text-muted-foreground mt-2 max-w-lg">
                  Odkryj naszą ekskluzywną kolekcję produktów premium. 
                  Każdy produkt starannie wyselekcjonowany dla wymagających klientów.
                </p>
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    className={`whitespace-nowrap transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="product-grid">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Brak produktów w tej kategorii.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                  O nas
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Prascy Bandyci
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Jesteśmy zespołem profesjonalistów, którzy stawiają na jakość 
                    i bezpieczeństwo. Nasza platforma łączy najlepsze rozwiązania 
                    e-commerce z bezpośrednią komunikacją przez Telegram.
                  </p>
                  <p>
                    Oferujemy elastyczne opcje dostawy - od paczkomatów InPost 
                    po bezpieczny odbiór osobisty (H2H) z weryfikacją tożsamości. 
                    Twoje bezpieczeństwo jest dla nas priorytetem.
                  </p>
                  <p>
                    Akceptujemy oficjalne metody płatności: karty płatnicze (Stripe), 
                    przelewy bankowe (Przelewy24) oraz BLIK.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden border border-border group">
                  <img 
                    src="https://images.pexels.com/photos/17419472/pexels-photo-17419472.jpeg?w=600" 
                    alt="Premium lifestyle"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
