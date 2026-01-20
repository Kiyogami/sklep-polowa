import { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, XCircle, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import VerificationCard from '@/components/admin/VerificationCard';
import { adminApi } from '@/services/api'; // Import API
import { toast } from 'sonner';

export default function AdminVerifications() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch verifications from API
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getVerifications();
      // data from API is list of OrderOut
      // Map OrderOut to verification format if needed, or pass OrderOut directly
      // VerificationCard expects: { id, orderId, customerName, status, videoUrl, ... }
      // OrderOut has: { id, customer: { name }, verification: { status, videoUrl }, ... }
      
      const mapped = data.map(order => ({
          id: order.id, // verification id not distinct in OrderOut, usually one per order
          orderId: order.id,
          customerName: order.customer.name,
          status: order.verification.status,
          videoUrl: order.verification.videoUrl,
          submittedAt: order.updatedAt, // Approximate
          notes: order.verification.notes
      }));
      
      setVerifications(mapped);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
      toast.error('Błąd pobierania weryfikacji');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

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

  const handleApprove = async (verificationId, notes) => {
    try {
        await adminApi.updateVerification(verificationId, 'approved');
        toast.success('Weryfikacja zatwierdzona');
        fetchVerifications(); // Refresh
    } catch (error) {
        toast.error('Błąd zatwierdzania');
    }
  };

  const handleReject = async (verificationId, reason) => {
    try {
        await adminApi.updateVerification(verificationId, 'rejected');
        toast.success('Weryfikacja odrzucona');
        fetchVerifications(); // Refresh
    } catch (error) {
        toast.error('Błąd odrzucania');
    }
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

      {/* Loading */}
      {loading && (
          <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )}

      {/* Verifications Grid */}
      {!loading && (
        filteredVerifications.length > 0 ? (
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
        )
      )}
    </div>
  );
}
