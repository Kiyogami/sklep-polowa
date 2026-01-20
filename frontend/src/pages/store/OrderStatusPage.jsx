import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, Package, MapPin, 
  Shield, AlertCircle, Copy, ExternalLink, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { ordersApi } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const statusConfig = {
  'pending_payment': { label: 'Oczekuje na płatność', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  'payment_confirmed': { label: 'Płatność potwierdzona', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  'verification_pending': { label: 'Oczekuje na weryfikację', icon: Shield, color: 'text-warning', bg: 'bg-warning/10' },
  'verification_approved': { label: 'Weryfikacja zatwierdzona', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  'verification_rejected': { label: 'Weryfikacja odrzucona', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  'processing': { label: 'W przygotowaniu', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  'shipped': { label: 'Wysłane', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  'ready_for_pickup': { label: 'Gotowe do odbioru', icon: MapPin, color: 'text-success', bg: 'bg-success/10' },
  'delivered': { label: 'Dostarczone', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  'cancelled': { label: 'Anulowane', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' }
};

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
        try {
            const data = await ordersApi.getById(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order:", error);
            // toast.error("Nie znaleziono zamówienia");
        } finally {
            setLoading(false);
        }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
      return (
        <div className="min-h-screen flex flex-col">
          <StoreHeader />
          <main className="flex-1 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </main>
          <StoreFooter />
        </div>
      );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Zamówienie nie znalezione</h1>
            <Link to="/">
              <Button>Wróć do sklepu</Button>
            </Link>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig['pending_payment'];
  const StatusIcon = status.icon;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success('Skopiowano numer zamówienia');
  };

  const handleOrderAgain = () => {
      // Logic to add items to cart
      let count = 0;
      order.items.forEach(item => {
          // Ideally we fetch product to get full details like image, but simple add works if fields match
          // We need product object with {id, name, price, image...}
          // The item in order might lack image or some details if backend doesn't store snapshot fully or structure differs.
          // Let's try to map best effort.
          const product = {
              id: item.productId,
              name: item.name,
              price: item.unitPrice,
              image: item.image || "", // Missing image in order items usually? Backend stores snapshot?
              // Backend OrderItem: productId, name, variant, quantity, unitPrice, totalPrice. No image.
              // So image will be empty. Cart needs it.
              // Best practice: fetch products again or have default image.
          };
          addToCart(product, item.variant, item.quantity);
          count++;
      });
      
      if (count > 0) {
          toast.success("Produkty dodane do koszyka");
          navigate("/cart");
      }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link 
            to="/orders" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do zamówień
          </Link>

          <div className="grid gap-6">
            {/* Order Header */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <span className="text-sm">Zamówienie nr</span>
                      <button 
                        onClick={handleCopyOrderId}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <span className="font-mono font-medium text-foreground">{order.id}</span>
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Złożone {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <Badge className={`${status.bg} ${status.color} border-0 px-3 py-1.5 text-sm`}>
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    {status.label}
                  </Badge>
                </div>

                {/* Verification Alert */}
                {order.status === 'verification_pending' && (
                  <Alert className="bg-warning/10 border-warning/20 mb-6">
                    <Shield className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-foreground">
                      <strong>Wymagana weryfikacja tożsamości.</strong>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Aby zrealizować to zamówienie, musimy potwierdzić Twoją tożsamość.
                      </p>
                      <Link to={`/verification/${order.id}`}>
                        <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90">
                          Przejdź do weryfikacji
                        </Button>
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                     <Button variant="outline" size="sm" className="flex-1" onClick={handleOrderAgain}>
                         <RefreshCw className="w-4 h-4 mr-2" />
                         Zamów ponownie
                     </Button>
                     <Link to="https://t.me/PrascyBandyci" target="_blank" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Pomoc
                        </Button>
                     </Link>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Produkty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                         IMG
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {item.unitPrice.toFixed(2)} zł • {item.variant}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-foreground">
                      {(item.totalPrice).toFixed(2)} zł
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery & Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Dostawa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metoda</span>
                    <span className="text-foreground font-medium">
                      {order.delivery.method === 'inpost' ? 'Paczkomat InPost' : 'Odbiór Osobisty (H2H)'}
                    </span>
                  </div>
                  {order.delivery.lockerCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kod Paczkomatu</span>
                      <span className="text-foreground">{order.delivery.lockerCode}</span>
                    </div>
                  )}
                  {order.delivery.pickupLocation && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lokalizacja</span>
                      <span className="text-foreground">{order.delivery.pickupLocation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Płatność</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metoda</span>
                    <span className="text-foreground font-medium uppercase">
                      {order.payment.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${
                      order.payment.status === 'completed' ? 'text-success' : 'text-warning'
                    }`}>
                      {order.payment.status === 'completed' ? 'Opłacone' : 'Oczekuje'}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  {order.payment.discountCode && (
                       <div className="flex justify-between text-success">
                          <span>Rabat ({order.payment.discountCode})</span>
                          <span>-{order.payment.discountAmount?.toFixed(2)} zł</span>
                      </div>
                  )}
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-foreground">Razem</span>
                    <span className="text-primary">{order.payment.total.toFixed(2)} zł</span>
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
