import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = login({ email, password });
    
    setTimeout(() => {
      if (result.success) {
        toast.success('Zalogowano pomyślnie');
      } else {
        toast.error(result.error || 'Błąd logowania');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-2xl text-primary-foreground">PB</span>
          </div>
          <CardTitle className="text-2xl font-display text-foreground">Panel Administracyjny</CardTitle>
          <CardDescription>Zaloguj się, aby zarządzać sklepem</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@prascy.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-input border-border text-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 bg-input border-border text-foreground"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: admin@prascy.pl / admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
