import { useState } from 'react';
import { Shield, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import VerificationCard from '@/components/admin/VerificationCard';
import { verifications } from '@/data/mockData';
import { toast } from 'sonner';

export default function AdminVerifications() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVerifications = verifications.filter(v => 
    statusFilter === 'all' || v.status === statusFilter
  );

  const statusCounts = {
    all: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    submitted: verifications.filter(v => v.status === 'submitted').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  };

  const handleApprove = (verificationId, notes) => {
    toast.success('Weryfikacja zatwierdzona', {
      description: `Weryfikacja ${verificationId} została zatwierdzona`
    });
  };

  const handleReject = (verificationId, reason) => {
    toast.error('Weryfikacja odrzucona', {
      description: `Weryfikacja ${verificationId} została odrzucona`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Weryfikacje</h1>
        <p className="text-muted-foreground mt-1">
          Przeglądaj i zatwierdzaj nagrania weryfikacyjne
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'all' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Wszystkie</p>
            <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'pending' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('pending')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Oczekujące</p>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">{statusCounts.pending}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'submitted' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('submitted')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-warning" />
              <p className="text-sm text-muted-foreground">Do sprawdzenia</p>
            </div>
            <p className="text-2xl font-bold text-warning">{statusCounts.submitted}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'approved' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('approved')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="text-sm text-muted-foreground">Zatwierdzone</p>
            </div>
            <p className="text-2xl font-bold text-success">{statusCounts.approved}</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card border-border cursor-pointer transition-colors ${statusFilter === 'rejected' ? 'border-primary' : 'hover:border-primary/50'}`}
          onClick={() => setStatusFilter('rejected')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Odrzucone</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{statusCounts.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-input border-border">
            <SelectValue placeholder="Filtruj status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="pending">Oczekujące</SelectItem>
            <SelectItem value="submitted">Do sprawdzenia</SelectItem>
            <SelectItem value="approved">Zatwierdzone</SelectItem>
            <SelectItem value="rejected">Odrzucone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verifications Grid */}
      {filteredVerifications.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVerifications.map((verification) => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Brak weryfikacji do wyświetlenia</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
