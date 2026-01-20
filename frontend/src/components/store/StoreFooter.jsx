import { Link } from 'react-router-dom';
import { Shield, Lock, Truck, MessageCircle } from 'lucide-react';

export const StoreFooter = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Trust badges */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Bezpieczeństwo</p>
                <p className="text-xs text-muted-foreground">Weryfikacja tożsamości</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Płatności</p>
                <p className="text-xs text-muted-foreground">Oficjalne metody</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Dostawa</p>
                <p className="text-xs text-muted-foreground">InPost & H2H</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Telegram</p>
                <p className="text-xs text-muted-foreground">Bezpośredni kontakt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary-foreground">PB</span>
              </div>
              <span className="font-display text-xl font-semibold text-gold-gradient">
                Prascy Bandyci
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Premium sklep dla wymagających klientów. Bezpieczeństwo i jakość na pierwszym miejscu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Sklep</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Wszystkie produkty
                </Link>
              </li>
              <li>
                <Link to="/#premium" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Premium
                </Link>
              </li>
              <li>
                <Link to="/#limited" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Limited Edition
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Informacje</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/info/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link to="/info/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link to="/info/verification-info" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Weryfikacja tożsamości
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Telegram: @PrascyBandyci
              </li>
              <li className="text-sm text-muted-foreground">
                Email: kontakt@prascy.pl
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Prascy Bandyci. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Akceptujemy:</span>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-muted rounded text-xs font-medium">VISA</div>
              <div className="px-2 py-1 bg-muted rounded text-xs font-medium">MC</div>
              <div className="px-2 py-1 bg-muted rounded text-xs font-medium">BLIK</div>
              <div className="px-2 py-1 bg-muted rounded text-xs font-medium">P24</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
