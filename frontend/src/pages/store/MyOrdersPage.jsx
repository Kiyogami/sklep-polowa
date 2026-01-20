import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, Shield, AlertCircle, MapPin, Loader2, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { useTelegram } from '@/context/TelegramContext';
import { ordersApi, loyaltyApi } from '@/services/api';
import { toast } from 'sonner';

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
  const { user, isTelegram } = useTelegram();
  const [orders, setOrders] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [ordersData, loyaltyData] = await Promise.all([
                ordersApi.getMyOrders().catch(e => []),
                loyaltyApi.getStatus().catch(e => null)
            ]);
            setOrders(ordersData);
            setLoyalty(loyaltyData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [isTelegram]);

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Moje zamówienia
            </h1>
            {isTelegram && user && (
              <p className="text-sm text-muted-foreground">
                Zalogowany jako {user.firstName} {user.lastName}
              </p>
            )}
          </div>

           {/* Loading */}
           {loading && (
             <div className="flex justify-center py-10">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          )}

          {!loading && (
            <div className="space-y-6">
                
              {/* Loyalty Card */}
              {loyalty && (
                <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-24 h-24 text-primary" />
                     </div>
                     <CardContent className="p-5 relative z-10">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <p className="text-xs font-bold text-primary tracking-wider uppercase mb-1">Twój Poziom</p>
                                 <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                     {loyalty.level}
                                     {loyalty.level === 'Boss' && <span className="text-xl">👑</span>}
                                 </h2>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-muted-foreground mb-1">Punkty lojalnościowe</p>
                                 <p className="text-xl font-mono font-bold text-primary">{loyalty.points} pkt</p>
                             </div>
                         </div>
                         
                         {loyalty.level !== 'Boss' && (
                             <div className="space-y-2">
                                 <div className="flex justify-between text-xs text-muted-foreground">
                                     <span>Postęp do następnego poziomu</span>
                                     <span>{Math.round(loyalty.progress)}%</span>
                                 </div>
                                 <Progress value={loyalty.progress} className="h-2 bg-muted/50" />
                                 <p className="text-xs text-muted-foreground mt-1">
                                     Brakuje {loyalty.nextLevelThreshold - loyalty.points} pkt do awansu.
                                 </p>
                             </div>
                         )}
                     </CardContent>
                </Card>
              )}
            
              {/* Orders List */}
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
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
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
