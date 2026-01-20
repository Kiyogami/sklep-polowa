import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useTelegram } from '@/context/TelegramContext';

export const StoreHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isTelegram } = useTelegram();
  const cartCount = getCartCount();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all">
              <span className="font-display font-bold text-sm sm:text-lg text-primary-foreground">PB</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-semibold text-gold-gradient block">
              Prascy Bandyci
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              Sklep
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/orders" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              Moje zamówienia
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/info/about" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              O nas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Orders (Desktop icon) */}
            <Link to="/orders" className="hidden sm:block">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/5 hover:text-primary">
                <Package className="h-5 w-5" />
              </Button>
            </Link>

            {/* Telegram User Avatar */}
            {isTelegram && user && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary">{user.firstName}</span>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/5 hover:text-primary transition-all hover:scale-105">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs animate-in zoom-in"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5 fade-in">
            <div className="flex flex-col gap-1">
              {isTelegram && user && (
                <div className="flex items-center gap-2 px-2 py-3 rounded-lg bg-primary/5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    )}
                  </div>
                </div>
              )}
              <Link 
                to="/" 
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-3 rounded-lg hover:bg-primary/5"
              >
                <ShoppingBag className="w-5 h-5" />
                Sklep
              </Link>
              <Link 
                to="/orders" 
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-3 rounded-lg hover:bg-primary/5"
              >
                <Package className="w-5 h-5" />
                Moje zamówienia
              </Link>
              <Link 
                to="/info/about" 
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-3 rounded-lg hover:bg-primary/5"
              >
                <User className="w-5 h-5" />
                O nas
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default StoreHeader;
