import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import VideoRecorder from '@/components/store/VideoRecorder';
import { toast } from 'sonner';

export default function VerificationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('info'); // info, record, complete
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoRecorded = async (videoBlob, orderId) => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setStep('complete');
      toast.success('Nagranie przesłane!', {
        description: 'Twoja weryfikacja jest teraz przetwarzana.'
      });
    }, 2000);
  };

  const handleSkipVerification = () => {
    toast.info('Weryfikacja pominięta', {
      description: 'Zamówienie zostało złożone, ale może wymagać dodatkowej weryfikacji.'
    });
    navigate(`/order/${orderId}`);
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md w-full mx-4 bg-card border-border">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Weryfikacja przesłana!
              </h1>
              <p className="text-muted-foreground mb-6">
                Twoje nagranie zostało przesłane i oczekuje na weryfikację. 
                Otrzymasz powiadomienie na Telegramie o statusie.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate(`/order/${orderId}`)}
                >
                  Zobacz status zamówienia
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border"
                  onClick={() => navigate('/')}
                >
                  Wróć do sklepu
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Weryfikacja tożsamości
            </h1>
            <p className="text-muted-foreground">
              Zamówienie #{orderId}
            </p>
          </div>

          {step === 'info' && (
            <div className="space-y-6">
              {/* Why verification */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    Dlaczego weryfikacja?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Weryfikacja tożsamości pomaga nam zapewnić bezpieczeństwo transakcji 
                    i chronić zarówno kupujących, jak i sprzedających przed oszustwami.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Ochrona przed oszustwami</p>
                        <p className="text-sm text-muted-foreground">
                          Weryfikacja potwierdza tożsamość kupującego i intencję zakupu.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Bezpieczeństwo danych</p>
                        <p className="text-sm text-muted-foreground">
                          Nagranie jest przechowywane bezpiecznie i usuwane po 30 dniach.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Zgodność z RODO</p>
                        <p className="text-sm text-muted-foreground">
                          Przetwarzamy dane zgodnie z przepisami o ochronie danych osobowych.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to do */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Co musisz zrobić?</CardTitle>
                  <CardDescription>
                    Nagraj krótkie wideo (5-10 sekund) zgodnie z instrukcją
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">1</span>
                      <span>Pokaż wyraźnie swoją twarz (w dobrym oświetleniu)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">2</span>
                      <span>Powiedz: "Potwierdzam zamówienie numer {orderId}"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">3</span>
                      <span>Możesz nagrać ponownie, jeśli coś pójdzie nie tak</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Consent */}
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="consent"
                      checked={acceptedTerms}
                      onCheckedChange={setAcceptedTerms}
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                      Wyrażam zgodę na przetwarzanie mojego wizerunku w celu weryfikacji zamówienia. 
                      Rozumiem, że nagranie będzie przechowywane maksymalnie 30 dni i używane 
                      wyłącznie do weryfikacji tej transakcji. Mogę wycofać zgodę kontaktując się 
                      z obsługą klienta.
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 btn-gold-glow"
                  onClick={() => setStep('record')}
                  disabled={!acceptedTerms}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Rozpocznij weryfikację
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={handleSkipVerification}
                >
                  Pomiń (może opóźnić zamówienie)
                </Button>
              </div>
            </div>
          )}

          {step === 'record' && (
            <div className="space-y-6">
              <Alert className="bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Upewnij się, że jesteś w dobrze oświetlonym miejscu i mówisz wyraźnie.
                </AlertDescription>
              </Alert>

              <VideoRecorder 
                orderId={orderId}
                onVideoRecorded={handleVideoRecorded}
              />

              {isUploading && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-muted-foreground">Przesyłanie nagrania...</span>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-border"
                onClick={() => setStep('info')}
              >
                Wróć do informacji
              </Button>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
