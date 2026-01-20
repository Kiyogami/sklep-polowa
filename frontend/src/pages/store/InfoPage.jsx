import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';

const CONTENT = {
  terms: {
    title: 'Regulamin Sklepu',
    content: `
      1. Postanowienia ogólne
      Niniejszy regulamin określa zasady korzystania ze sklepu internetowego Prascy Bandyci.
      
      2. Zamówienia
      Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu.
      
      3. Płatności
      Obsługujemy płatności: Stripe (karty), Przelewy24, BLIK oraz płatności przy odbiorze (dla stałych klientów).
      
      4. Dostawa
      Oferujemy wysyłkę do Paczkomatów InPost oraz odbiór osobisty (H2H) w wybranych lokalizacjach.
      
      5. Weryfikacja
      Niektóre produkty wymagają weryfikacji tożsamości. Sklep zastrzega sobie prawo do odmowy sprzedaży osobom niezweryfikowanym.
    `
  },
  privacy: {
    title: 'Polityka Prywatności',
    content: `
      1. Administrator Danych
      Administratorem Twoich danych osobowych jest Prascy Bandyci.
      
      2. Cel przetwarzania
      Dane przetwarzane są wyłącznie w celu realizacji zamówień i weryfikacji tożsamości.
      
      3. Usuwanie danych
      Nagrania wideo z weryfikacji są usuwane automatycznie po 30 dniach od zakończenia transakcji.
      
      4. Bezpieczeństwo
      Stosujemy szyfrowanie SSL oraz bezpieczne serwery do przechowywania Twoich danych.
    `
  },
  'verification-info': {
    title: 'Zasady Weryfikacji',
    content: `
      1. Dlaczego weryfikujemy?
      Weryfikacja H2H (Human to Human) służy bezpieczeństwu obu stron transakcji.
      
      2. Jak to działa?
      Podczas składania zamówienia z odbiorem osobistym, zostaniesz poproszony o nagranie krótkiego wideo (max 8s).
      
      3. Co musi być na wideo?
      Na wideo powinna być widoczna Twoja twarz oraz kartka z aliasem odbioru lub numerem zamówienia.
      
      4. Co się dzieje z nagraniem?
      Nagranie trafia do naszego bezpiecznego systemu, jest sprawdzane przez administratora, a następnie usuwane po 30 dniach.
    `
  }
};

export default function InfoPage() {
  const { slug } = useParams(); // e.g. /info/terms
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate loading or fetch from backend if CMS exists
    setData(CONTENT[slug] || { title: 'Nie znaleziono', content: 'Strona nie istnieje.' });
  }, [slug]);

  if (!data) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do sklepu
          </Link>

          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {data.title}
              </h1>
            </div>

            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {data.content}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
