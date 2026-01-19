import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, Shield, AlertCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { useOrders } from '@/context/OrdersContext';
import { useTelegram } from '@/context/TelegramContext';

const statusConfig = {
  'pending_payment': { 
    label: 'Oczekuje na płatność', 
    icon: Clock, 
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  'payment_confirmed': { 
    label: 'Opłacone', 
    icon: CheckCircle, 
    color: 'text-success',
    bg: 'bg-success/10'
  },
  'verification_pending': { 
    label: 'Weryfikacja', 
    icon: Shield, 
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  'verification_approved': { 
    label: 'Zweryfikowane', 
    icon: Shield, 
    color: 'text-success',
    bg: 'bg-success/10'
  },
  'verification_rejected': { 
    label: 'Weryfikacja odrzucona', 
    icon: AlertCircle, 
    color: 'text-destructive',
    bg: 'bg-destructive/10'
  },
  'processing': { 
    label: 'W przygotowaniu', 
    icon: Package, 
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  'shipped': { 
    label: 'Wysłane', 
    icon: Truck, 
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  'ready_for_pickup': { 
    label: 'Gotowe do odbioru', 
    icon: MapPin, 
    color: 'text-success',
    bg: 'bg-success/10'
  },
  'delivered': { 
    label: 'Dostarczone', 
    icon: CheckCircle, 
    color: 'text-success',
    bg: 'bg-success/10'
  },
  'cancelled': { 
    label: 'Anulowane', 
    icon: AlertCircle, 
    color: 'text-destructive',
    bg: 'bg-destructive/10'
  }
};

const OrderCard = ({ order }) => {
  const status = statusConfig[order.status] || statusConfig['pending_payment'];
  const StatusIcon = status.icon;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link to={`/order/${order.id}`}>
      <Card className="bg-card border-border hover:border-primary/30 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Order ID and Status */}
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-medium text-foreground">
                  {order.id}
                </span>
                <Badge className={`${status.bg} ${status.color} border-0 text-xs`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              {/* Items */}
              <div className="text-sm text-muted-foreground mb-2">
                {order.items?.slice(0, 2).map((item, idx) => (
                  <span key={idx}>
                    {item.quantity}x {item.name}
                    {idx < Math.min(order.items.length, 2) - 1 && ', '}
                  </span>
                ))}
                {order.items?.length > 2 && (
                  <span className="text-muted-foreground"> +{order.items.length - 2} więcej</span>
                )}
              </div>

              {/* Date and Delivery */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{formatDate(order.createdAt)}</span>
                <span>•</span>
                <span>
                  {order.deliveryMethod === 'inpost' ? 'InPost' : 'Odbiór osobisty'}
                </span>
              </div>
            </div>

            {/* Total and Arrow */}
            <div className="text-right flex items-center gap-2">
              <div>
                <p className="font-display text-lg font-bold text-primary">
                  {order.total?.toFixed(2)} zł
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function MyOrdersPage() {
  const { orders } = useOrders();
  const { user, isTelegram } = useTelegram();

  // Demo orders if no real orders exist
  const demoOrders = [
    {
      id: 'ORD-DEMO-001',
      status: 'shipped',
      items: [
        { name: 'BUCH Premium', variant: 'L', quantity: 1, price: 299.99 }
      ],
      total: 312.98,
      deliveryMethod: 'inpost',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ORD-DEMO-002',
      status: 'verification_pending',
      items: [
        { name: 'KOKO Gold Edition', variant: 'Platinum', quantity: 1, price: 449.99 }
      ],
      total: 449.99,
      deliveryMethod: 'h2h',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ORD-DEMO-003',
      status: 'delivered',
      items: [
        { name: 'MEF Classic', variant: 'Standard', quantity: 2, price: 199.99 },
        { name: 'PIGULY Set', variant: '3-Pack', quantity: 1, price: 349.99 }
      ],
      total: 762.96,
      deliveryMethod: 'inpost',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayOrders = orders.length > 0 ? orders : demoOrders;

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Moje zamówienia
            </h1>
            {isTelegram && user && (
              <p className="text-sm text-muted-foreground">
                Zalogowany jako {user.firstName} {user.lastName}
              </p>
            )}
          </div>

          {/* Orders List */}
          {displayOrders.length > 0 ? (
            <div className="space-y-4">
              {displayOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Brak zamówień
                </h2>
                <p className="text-muted-foreground mb-6">
                  Nie masz jeszcze żadnych zamówień. Zacznij zakupy!
                </p>
                <Link to="/">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Przeglądaj produkty
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Info note */}
          {orders.length === 0 && displayOrders.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-6">
              * Pokazane zamówienia są przykładowe (demo)
            </p>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
