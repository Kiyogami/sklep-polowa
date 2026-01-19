import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Shield, Truck, Package, Minus, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Produkt nie znaleziony</h1>
            <Link to="/">
              <Button>Wróć do sklepu</Button>
            </Link>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const currentStock = product.stock[selectedVariant] || 0;
  const isInStock = currentStock > 0;

  const handleAddToCart = () => {
    if (!isInStock) return;
    
    addToCart(product, selectedVariant, quantity);
    toast.success('Dodano do koszyka', {
      description: `${product.name} (${selectedVariant}) x${quantity}`
    });
  };

  const handleBuyNow = () => {
    if (!isInStock) return;
    
    addToCart(product, selectedVariant, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do sklepu
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.requiresVerification && (
                  <Badge variant="secondary" className="bg-card border-border">
                    <Shield className="w-3 h-3 mr-1" />
                    Wymaga weryfikacji H2H
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-primary">
                  {product.price.toFixed(2)} zł
                </span>
              </div>

              {/* Verification warning */}
              {product.requiresVerification && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <strong>Ten produkt wymaga weryfikacji tożsamości</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Przy odbiorze osobistym (H2H) wymagamy nagrania krótkiego wideo 
                      weryfikacyjnego w celu zwiększenia bezpieczeństwa transakcji.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Variant Selection */}
              <div>
                <Label className="text-foreground font-medium mb-3 block">
                  Wybierz wariant
                </Label>
                <RadioGroup 
                  value={selectedVariant} 
                  onValueChange={setSelectedVariant}
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((variant) => {
                    const stock = product.stock[variant] || 0;
                    const available = stock > 0;
                    
                    return (
                      <div key={variant}>
                        <RadioGroupItem 
                          value={variant} 
                          id={variant}
                          className="peer sr-only"
                          disabled={!available}
                        />
                        <Label
                          htmlFor={variant}
                          className={`
                            flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer
                            transition-all
                            ${selectedVariant === variant 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border hover:border-primary/50 text-foreground'
                            }
                            ${!available && 'opacity-50 cursor-not-allowed'}
                          `}
                        >
                          {variant}
                          {!available && <span className="ml-1 text-xs">(Brak)</span>}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                <p className="text-sm text-muted-foreground mt-2">
                  Dostępność: {currentStock > 0 ? `${currentStock} szt.` : 'Brak w magazynie'}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <Label className="text-foreground font-medium mb-3 block">
                  Ilość
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border hover:bg-muted"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border hover:bg-muted"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 btn-gold-glow"
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Kup teraz
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted hover:border-primary/50"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  Dodaj do koszyka
                </Button>
              </div>

              {/* Delivery info */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-3">Opcje dostawy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">InPost Paczkomat</p>
                        <p className="text-xs text-muted-foreground">12,99 zł • 1-2 dni</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Odbiór osobisty (H2H)</p>
                        <p className="text-xs text-muted-foreground">Gratis • Do ustalenia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
