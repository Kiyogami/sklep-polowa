import { useState } from 'react';
import { Search, Filter, Package, Truck, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import OrdersTable from '@/components/admin/OrdersTable';
import { orders } from '@/data/mockData';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.telegramId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDelivery = deliveryFilter === 'all' || order.deliveryMethod === deliveryFilter;

    return matchesSearch && matchesStatus && matchesDelivery;
  });

  const handleViewOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    toast.success('Status zaktualizowany', {
      description: `Zamówienie ${orderId} zmienione na ${newStatus}`
    });
  };

  const statusCounts = {
    all: orders.length,
    verification_pending: orders.filter(o => o.status === 'verification_pending').length,
    payment_confirmed: orders.filter(o => o.status === 'payment_confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Zamówienia</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj zamówieniami i wysyłkami
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'all' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Wszystkie</p>
            <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'verification_pending' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('verification_pending')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-warning" />
              <p className="text-sm text-muted-foreground">Weryfikacja</p>
            </div>
            <p className="text-2xl font-bold text-warning">{statusCounts.verification_pending}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'payment_confirmed' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('payment_confirmed')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Do wysłania</p>
            </div>
            <p className="text-2xl font-bold text-primary">{statusCounts.payment_confirmed}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'shipped' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('shipped')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-success" />
              <p className="text-sm text-muted-foreground">Wysłane</p>
            </div>
            <p className="text-2xl font-bold text-success">{statusCounts.shipped}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj zamówienia, klienta, telegram..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-input border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="created">Utworzone</SelectItem>
                  <SelectItem value="payment_confirmed">Opłacone</SelectItem>
                  <SelectItem value="verification_pending">Weryfikacja</SelectItem>
                  <SelectItem value="verification_approved">Zweryfikowane</SelectItem>
                  <SelectItem value="shipped">Wysłane</SelectItem>
                  <SelectItem value="ready_for_pickup">Do odbioru</SelectItem>
                </SelectContent>
              </Select>
              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger className="w-[130px] bg-input border-border">
                  <SelectValue placeholder="Dostawa" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="inpost">InPost</SelectItem>
                  <SelectItem value="h2h">H2H</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Lista zamówień ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <OrdersTable 
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Brak zamówień spełniających kryteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Zamówienie {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer info */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Klient</h4>
                <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                  <p className="text-foreground">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                  <p className="text-sm text-primary">{selectedOrder.customer.telegramId}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Produkty</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-foreground">
                        {item.quantity}x {item.name} ({item.variant})
                      </span>
                      <span className="text-primary font-medium">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Delivery */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dostawa</span>
                <Badge className={selectedOrder.deliveryMethod === 'h2h' ? 'bg-primary/15 text-primary' : ''}>
                  {selectedOrder.deliveryMethod === 'inpost' ? 'InPost' : 'H2H'}
                </Badge>
              </div>

              {selectedOrder.deliveryMethod === 'inpost' && selectedOrder.deliveryAddress && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Paczkomat:</p>
                  <p className="text-foreground">{selectedOrder.deliveryAddress.locker}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.deliveryAddress.lockerAddress}</p>
                </div>
              )}

              {selectedOrder.deliveryMethod === 'h2h' && selectedOrder.pickupLocation && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Lokalizacja odbioru:</p>
                  <p className="text-foreground">{selectedOrder.pickupLocation}</p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="font-semibold text-foreground">Razem</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {selectedOrder.total.toFixed(2)} zł
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
