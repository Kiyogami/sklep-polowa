import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const deliveryCost = 12.99;
  const total = subtotal + (cart.length > 0 ? deliveryCost : 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Koszyk jest pusty</h1>
            <p className="text-muted-foreground mb-6">
              Dodaj produkty do koszyka, aby kontynuować zakupy.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Przeglądaj produkty
              </Button>
            </Link>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

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
            Kontynuuj zakupy
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            Twój koszyk
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={`${item.productId}-${item.variant}`} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.productId}`}>
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/product/${item.productId}`}>
                              <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Wariant: {item.variant}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.productId, item.variant)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-border"
                              onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-border"
                              onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <p className="font-semibold text-primary">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear cart */}
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Wyczyść koszyk
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg text-foreground mb-4">
                    Podsumowanie
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Produkty ({cart.length})</span>
                      <span className="text-foreground">{subtotal.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dostawa</span>
                      <span className="text-foreground">od {deliveryCost.toFixed(2)} zł</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-border" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Razem</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {total.toFixed(2)} zł
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 btn-gold-glow"
                    onClick={() => navigate('/checkout')}
                  >
                    Przejdź do kasy
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Bezpieczne płatności przez Stripe, Przelewy24 i BLIK
                  </p>
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
