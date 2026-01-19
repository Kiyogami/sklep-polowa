import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import OrderTimeline from '@/components/store/OrderTimeline';

// Mock order data for demo
const getMockOrder = (orderId) => ({
  id: orderId,
  status: 'verification_pending',
  customer: {
    name: 'Jan Kowalski',
    email: 'jan@example.com'
  },
  items: [
    { name: 'BUCH Premium', variant: 'L', quantity: 1, price: 299.99 }
  ],
  total: 312.98,
  deliveryMethod: 'h2h',
  deliveryCost: 0,
  pickupLocation: 'Warszawa, Centrum',
  requiresVerification: true,
  verificationStatus: 'pending',
  createdAt: new Date().toISOString(),
  trackingNumber: null
});

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const order = getMockOrder(orderId);

  const statusLabels = {
    'created': 'Utworzone',
    'payment_confirmed': 'Opłacone',
    'verification_pending': 'Oczekuje na weryfikację',
    'verification_approved': 'Zweryfikowane',
    'shipped': 'Wysłane',
    'ready_for_pickup': 'Gotowe do odbioru',
    'delivered': 'Dostarczone'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do sklepu
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Zamówienie #{order.id}
              </h1>
              <p className="text-muted-foreground mt-1">
                Złożone: {new Date(order.createdAt).toLocaleDateString('pl-PL')}
              </p>
            </div>
            <Badge className="self-start sm:self-auto bg-primary/15 text-primary border-primary/30 text-sm px-3 py-1">
              {statusLabels[order.status]}
            </Badge>
          </div>

          <div className="grid gap-6">
            {/* Order Timeline */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Status zamówienia</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline 
                  currentStatus={order.status}
                  requiresVerification={order.requiresVerification}
                />
              </CardContent>
            </Card>

            {/* Verification status */}
            {order.requiresVerification && order.verificationStatus === 'pending' && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Weryfikacja oczekuje
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Twoje nagranie weryfikacyjne jest sprawdzane. 
                        Otrzymasz powiadomienie gdy zostanie zatwierdzone.
                      </p>
                      <Link to={`/verification/${order.id}`}>
                        <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10">
                          Prześlij ponownie
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Informacje o dostawie</CardTitle>
              </CardHeader>
              <CardContent>
                {order.deliveryMethod === 'inpost' ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">InPost Paczkomat</p>
                        <p className="text-sm text-muted-foreground">
                          {order.deliveryAddress?.locker || 'WAW123'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.deliveryAddress?.lockerAddress || 'ul. Marszałkowska 100, Warszawa'}
                        </p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Numer przesyłki:</p>
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1.5 bg-muted rounded text-foreground">
                            {order.trackingNumber}
                          </code>
                          <a 
                            href={`https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="outline" className="border-border">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Śledź
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Odbiór osobisty (H2H)</p>
                      <p className="text-sm text-muted-foreground">
                        {order.pickupLocation}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Szczegóły odbioru zostaną ustalone przez Telegram
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Szczegóły zamówienia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name} ({item.variant})
                      </span>
                      <span className="text-foreground">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dostawa</span>
                    <span className="text-foreground">
                      {order.deliveryCost > 0 ? `${order.deliveryCost.toFixed(2)} zł` : 'Gratis'}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4 bg-border" />
                
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Razem</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {order.total.toFixed(2)} zł
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Potrzebujesz pomocy?</h3>
                    <p className="text-sm text-muted-foreground">
                      Skontaktuj się z nami przez Telegram
                    </p>
                  </div>
                  <a href="https://t.me/PrascyBandyci" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
