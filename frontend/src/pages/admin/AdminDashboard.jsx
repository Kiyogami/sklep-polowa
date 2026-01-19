import { ShoppingBag, Package, Shield, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/admin/StatsCard';
import OrdersTable from '@/components/admin/OrdersTable';
import { orders, statistics } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const handleViewOrder = (orderId) => {
    console.log('View order:', orderId);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Update order:', orderId, 'to', newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Witaj w panelu administracyjnym Prascy Bandyci
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Wszystkie zamówienia"
          value={statistics.totalOrders}
          icon={ShoppingBag}
          trend="up"
          trendValue="+12% w tym miesiącu"
        />
        <StatsCard
          title="Oczekujące"
          value={statistics.pendingOrders}
          icon={Clock}
          subtitle="Wymagają akcji"
        />
        <StatsCard
          title="Przychód"
          value={`${statistics.totalRevenue.toLocaleString('pl-PL')} zł`}
          icon={DollarSign}
          trend="up"
          trendValue={`+${statistics.monthlyGrowth}%`}
        />
        <StatsCard
          title="Do weryfikacji"
          value={statistics.verificationsToReview}
          icon={Shield}
          subtitle="Nagrania do sprawdzenia"
        />
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Przychody (ostatnie 7 dni)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statistics.recentOrders}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value} zł`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pl-PL')}
                    formatter={(value) => [`${value} zł`, 'Przychód']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(45, 93%, 47%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{statistics.verificationsToReview}</p>
                  <p className="text-xs text-muted-foreground">Weryfikacje do sprawdzenia</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{statistics.ordersToShip}</p>
                  <p className="text-xs text-muted-foreground">Zamówienia do wysłania</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{statistics.averageOrderValue.toFixed(2)} zł</p>
                  <p className="text-xs text-muted-foreground">Średnia wartość zamówienia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Ostatnie zamówienia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable 
            orders={orders.slice(0, 5)} 
            onViewOrder={handleViewOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}
