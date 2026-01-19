import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import DeliverySelector from '@/components/store/DeliverySelector';
import PaymentSelector from '@/components/store/PaymentSelector';
import { useCart } from '@/context/CartContext';
import { products, deliveryMethods } from '@/data/mockData';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    telegram: ''
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState('inpost');
  const [lockerCode, setLockerCode] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('blik');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptVerification, setAcceptVerification] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if any product requires verification
  const requiresVerification = cart.some(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.requiresVerification;
  }) || deliveryMethod === 'h2h';

  const selectedDeliveryMethod = deliveryMethods.find(m => m.id === deliveryMethod);
  const deliveryCost = selectedDeliveryMethod?.price || 0;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryCost;

  const isFormValid = () => {
    if (!customerData.name || !customerData.email || !customerData.phone) return false;
    if (!acceptTerms) return false;
    if (requiresVerification && !acceptVerification) return false;
    if (deliveryMethod === 'inpost' && !lockerCode) return false;
    if (deliveryMethod === 'h2h' && !pickupLocation) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Wypełnij wszystkie wymagane pola');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      
      // Clear cart
      clearCart();
      
      // Navigate based on whether verification is needed
      if (requiresVerification) {
        navigate(`/verification/${orderId}`);
      } else {
        toast.success('Zamówienie złożone!', {
          description: `Numer zamówienia: ${orderId}`
        });
        navigate(`/order/${orderId}`);
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć
          </button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            Finalizacja zamówienia
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer data */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Dane kontaktowe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Imię i nazwisko *</Label>
                        <Input
                          id="name"
                          placeholder="Jan Kowalski"
                          value={customerData.name}
                          onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1.5 bg-input border-border text-foreground"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jan@example.com"
                          value={customerData.email}
                          onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1.5 bg-input border-border text-foreground"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-foreground">Telefon *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+48 123 456 789"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1.5 bg-input border-border text-foreground"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telegram" className="text-foreground">Telegram (opcjonalnie)</Label>
                        <Input
                          id="telegram"
                          placeholder="@username"
                          value={customerData.telegram}
                          onChange={(e) => setCustomerData(prev => ({ ...prev, telegram: e.target.value }))}
                          className="mt-1.5 bg-input border-border text-foreground"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Metoda dostawy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeliverySelector
                      selectedMethod={deliveryMethod}
                      onMethodChange={setDeliveryMethod}
                      lockerCode={lockerCode}
                      onLockerCodeChange={setLockerCode}
                      pickupLocation={pickupLocation}
                      onPickupLocationChange={setPickupLocation}
                      requiresVerification={requiresVerification}
                    />
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Metoda płatności</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentSelector
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                    />
                  </CardContent>
                </Card>

                {/* Agreements */}
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={setAcceptTerms}
                      />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                        Akceptuję <a href="/terms" className="text-primary hover:underline">regulamin</a> oraz{' '}
                        <a href="/privacy" className="text-primary hover:underline">politykę prywatności</a>. *
                      </Label>
                    </div>

                    {requiresVerification && (
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id="verification"
                          checked={acceptVerification}
                          onCheckedChange={setAcceptVerification}
                        />
                        <Label htmlFor="verification" className="text-sm text-muted-foreground cursor-pointer">
                          Zgadzam się na weryfikację tożsamości poprzez nagranie wideo. 
                          Rozumiem, że nagranie będzie używane wyłącznie do weryfikacji zamówienia 
                          i zostanie usunięte po 30 dniach. *
                        </Label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-lg text-foreground mb-4">
                      Twoje zamówienie
                    </h2>

                    {/* Items */}
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name} ({item.variant})
                          </span>
                          <span className="text-foreground">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4 bg-border" />

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Produkty</span>
                        <span className="text-foreground">{subtotal.toFixed(2)} zł</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dostawa ({selectedDeliveryMethod?.name})</span>
                        <span className="text-foreground">
                          {deliveryCost > 0 ? `${deliveryCost.toFixed(2)} zł` : 'Gratis'}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-border" />

                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Do zapłaty</span>
                      <span className="font-display text-xl font-bold text-primary">
                        {total.toFixed(2)} zł
                      </span>
                    </div>

                    {requiresVerification && (
                      <Alert className="mt-4 bg-primary/5 border-primary/20">
                        <Shield className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-xs text-muted-foreground">
                          Po złożeniu zamówienia zostaniesz przekierowany do weryfikacji tożsamości.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 btn-gold-glow"
                      disabled={!isFormValid() || isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Przetwarzanie...
                        </span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Złóż zamówienie
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Bezpieczna płatność SSL
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
