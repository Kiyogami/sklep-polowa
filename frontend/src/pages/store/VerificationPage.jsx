import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, FileText, Lock, ArrowLeft, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import VideoRecorder from '@/components/store/VideoRecorder';
import { useTelegram } from '@/context/TelegramContext';
import { toast } from 'sonner';

export default function VerificationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isTelegram, hapticFeedback, sendData } = useTelegram();
  
  const [step, setStep] = useState('info'); // info, record, uploading, complete
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationId, setVerificationId] = useState(null);

  // Za każdym razem, gdy wchodzimy w weryfikację dla innego zamówienia,
  // resetujemy stan kroków, żeby nie "pamiętać" poprzedniego nagrania.
  useEffect(() => {
    setStep('info');
    setAcceptedTerms(false);
    setUploadProgress(0);
    setVerificationId(null);
  }, [orderId]);

  // Handle video recorded
  const handleVideoRecorded = async (videoBlob, orderId) => {
    setStep('uploading');
    
    if (isTelegram) {
      hapticFeedback('impact', 'medium');
    }
    
    // Simulate upload with progress
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress((i / totalSteps) * 100);
    }
    
    // Generate verification ID
    const verId = `VER-${Date.now().toString().slice(-6)}`;
    setVerificationId(verId);
    
    // In production: upload to server
    // const formData = new FormData();
    // formData.append('video', videoBlob, `verification-${orderId}.webm`);
    // formData.append('orderId', orderId);
    // await fetch('/api/verifications/upload', { method: 'POST', body: formData });
    
    if (isTelegram) {
      hapticFeedback('notification', 'success');
      
      // Send data to Telegram bot
      sendData({
        action: 'verification_submitted',
        orderId,
        verificationId: verId,
        timestamp: new Date().toISOString()
      });
    }
    
    setStep('complete');
    toast.success('Nagranie przesłane!', {
      description: 'Twoja weryfikacja jest teraz przetwarzana.'
    });
  };

  // Handle skip verification
  const handleSkipVerification = () => {
    if (isTelegram) {
      hapticFeedback('notification', 'warning');
    }
    
    toast.info('Weryfikacja pominięta', {
      description: 'Zamówienie może wymagać dodatkowej weryfikacji przed realizacją.'
    });
    navigate(`/order/${orderId}`);
  };

  // Complete state
  if (step === 'complete') {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <Card className="max-w-md w-full bg-card border-border">
            <CardContent className="pt-8 pb-6 text-center">
              {/* Success animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                Weryfikacja przesłana!
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Twoje nagranie zostało przesłane i oczekuje na sprawdzenie. 
                Otrzymasz powiadomienie na Telegramie o wyniku.
              </p>

              {/* Verification ID */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">ID weryfikacji</p>
                <p className="font-mono text-lg font-semibold text-primary">{verificationId}</p>
              </div>

              {/* Status info */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  Czas weryfikacji: do 24 godzin
                </span>
              </div>

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

  // Uploading state
  if (step === 'uploading') {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <Card className="max-w-md w-full bg-card border-border">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <Send className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                Przesyłanie nagrania...
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Proszę czekać, trwa przesyłanie Twojego nagrania weryfikacyjnego.
              </p>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
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
      
      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back button */}
          <button 
            onClick={() => step === 'record' ? setStep('info') : navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'record' ? 'Wróć do informacji' : 'Wróć'}
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Weryfikacja tożsamości
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Zamówienie #{orderId}
            </Badge>
          </div>

          {step === 'info' && (
            <div className="space-y-5">
              {/* Telegram notice */}
              {isTelegram && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Send className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    Powiadomienie o statusie weryfikacji otrzymasz na Telegramie.
                  </AlertDescription>
                </Alert>
              )}

              {/* Why verification */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    Dlaczego weryfikacja?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Weryfikacja tożsamości chroni obie strony transakcji przed oszustwami 
                    i potwierdza intencję zakupu.
                  </p>
                  
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Ochrona przed oszustwami</p>
                        <p className="text-xs text-muted-foreground">
                          Potwierdzamy tożsamość kupującego
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Bezpieczeństwo danych</p>
                        <p className="text-xs text-muted-foreground">
                          Nagranie usuwane po 30 dniach (RODO)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to do */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-lg">Co musisz zrobić?</CardTitle>
                  <CardDescription>
                    Nagraj krótkie wideo (5-10 sekund)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">1</span>
                      <span className="text-sm text-muted-foreground">Pokaż wyraźnie swoją twarz (dobre oświetlenie)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">2</span>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Powiedz:</span>
                        <span className="text-primary font-medium ml-1">"Potwierdzam zamówienie {orderId}"</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">3</span>
                      <span className="text-sm text-muted-foreground">Możesz nagrać ponownie jeśli coś poszło nie tak</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Consent */}
              <Card className="bg-card border-border">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="consent"
                      checked={acceptedTerms}
                      onCheckedChange={setAcceptedTerms}
                      className="mt-0.5"
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      Wyrażam zgodę na przetwarzanie mojego wizerunku w celu weryfikacji zamówienia. 
                      Nagranie będzie przechowywane maksymalnie 30 dni i używane wyłącznie do 
                      weryfikacji tej transakcji.
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-gold-glow"
                  size="lg"
                  onClick={() => setStep('record')}
                  disabled={!acceptedTerms}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Rozpocznij weryfikację
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={handleSkipVerification}
                >
                  Pomiń weryfikację (może opóźnić realizację)
                </Button>
              </div>
            </div>
          )}

          {step === 'record' && (
            <div className="space-y-5">
              <Alert className="bg-warning/10 border-warning/30">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-foreground text-sm">
                  <strong>Wskazówki:</strong> Ustaw telefon na wysokości twarzy. 
                  Upewnij się, że masz dobre oświetlenie i mówisz wyraźnie.
                </AlertDescription>
              </Alert>

              <VideoRecorder 
                orderId={orderId}
                onVideoRecorded={handleVideoRecorded}
              />
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
