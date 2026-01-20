import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { useTelegram } from '@/context/TelegramContext';
import { useEffect } from 'react';
import { useOrders } from '@/context/OrdersContext';

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isTelegram, hapticFeedback, sendData, close } = useTelegram();
  const { getOrder } = useOrders();

  const order = orderId ? getOrder(orderId) : null;

  useEffect(() => {
    // Jeśli zamówienie nadal wymaga weryfikacji, a trafiliśmy na stronę sukcesu,
    // przekieruj użytkownika na ekran nagrywania.
    if (order && order.requiresVerification && order.status === 'verification_pending') {
      navigate(`/verification/${orderId}`, { replace: true });
      return;
    }

    // Haptic feedback on success
    if (isTelegram) {
      hapticFeedback('notification', 'success');
    }
  }, [order, orderId, isTelegram, hapticFeedback, navigate]);

  const handleSendToBot = () => {
    if (isTelegram) {
      sendData({
        action: 'order_completed',
        orderId: orderId,
        timestamp: new Date().toISOString()
      });
      close();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-card border-border">
            <CardContent className="pt-8 pb-6 text-center">
              {/* Success Animation */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Płatność potwierdzona!
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Twoje zamówienie zostało złożone i opłacone.
              </p>

              {/* Order ID */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Numer zamówienia</p>
                <p className="font-mono text-lg font-semibold text-primary">{orderId}</p>
              </div>

              {/* What's next */}
              <div className="text-left space-y-4 mb-6">
                <h3 className="font-medium text-foreground">Co dalej?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Otrzymasz potwierdzenie na Telegramie</p>
                      <p className="text-xs text-muted-foreground">Powiadomienie o statusie zamówienia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Przygotujemy Twoje zamówienie</p>
                      <p className="text-xs text-muted-foreground">Pakowanie i wysyłka w 24h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Śledź przesyłkę</p>
                      <p className="text-xs text-muted-foreground">Otrzymasz numer śledzenia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link to={`/order/${orderId}`} className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Package className="w-4 h-4 mr-2" />
                    Zobacz status zamówienia
                  </Button>
                </Link>

                {isTelegram ? (
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    onClick={handleSendToBot}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Wróć do bota
                  </Button>
                ) : (
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full border-border">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Kontynuuj zakupy
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
