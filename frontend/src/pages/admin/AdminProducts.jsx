import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Star, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { products } from '@/data/mockData';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalStock = (stock) => {
    return Object.values(stock).reduce((sum, qty) => sum + qty, 0);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = (productId) => {
    toast.success('Produkt usunięty', {
      description: `Produkt ${productId} został usunięty`
    });
  };

  const handleSaveProduct = () => {
    toast.success('Produkt zapisany');
    setSelectedProduct(null);
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Produkty</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj katalogiem produktów
          </p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj produkt
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj produktu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Lista produktów ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground font-medium">Produkt</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Kategoria</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Cena</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Stan</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Opcje</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {product.price.toFixed(2)} zł
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getTotalStock(product.stock) > 5 ? 'text-success' : getTotalStock(product.stock) > 0 ? 'text-warning' : 'text-destructive'}`}>
                        {getTotalStock(product.stock)} szt.
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.featured && (
                          <Star className="w-4 h-4 text-primary" />
                        )}
                        {product.requiresVerification && (
                          <Shield className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edytuj produkt: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Nazwa produktu</Label>
                <Input
                  defaultValue={selectedProduct.name}
                  className="mt-1.5 bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Opis</Label>
                <Input
                  defaultValue={selectedProduct.description}
                  className="mt-1.5 bg-input border-border text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Cena (zł)</Label>
                  <Input
                    type="number"
                    defaultValue={selectedProduct.price}
                    className="mt-1.5 bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Kategoria</Label>
                  <Input
                    defaultValue={selectedProduct.category}
                    className="mt-1.5 bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Warianty i stany magazynowe</Label>
                <div className="space-y-2">
                  {Object.entries(selectedProduct.stock).map(([variant, qty]) => (
                    <div key={variant} className="flex items-center gap-3">
                      <Input
                        defaultValue={variant}
                        className="flex-1 bg-input border-border text-foreground"
                      />
                      <Input
                        type="number"
                        defaultValue={qty}
                        className="w-24 bg-input border-border text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={selectedProduct.featured} />
                  <Label className="text-foreground">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={selectedProduct.requiresVerification} />
                  <Label className="text-foreground">Wymaga weryfikacji</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Anuluj
            </Button>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveProduct}
            >
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Dodaj nowy produkt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Nazwa produktu</Label>
              <Input
                placeholder="Nazwa produktu"
                className="mt-1.5 bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label className="text-foreground">Opis</Label>
              <Input
                placeholder="Opis produktu"
                className="mt-1.5 bg-input border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Cena (zł)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="mt-1.5 bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Kategoria</Label>
                <Input
                  placeholder="premium"
                  className="mt-1.5 bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground">URL zdjęcia</Label>
              <Input
                placeholder="https://..."
                className="mt-1.5 bg-input border-border text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch />
                <Label className="text-foreground">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label className="text-foreground">Wymaga weryfikacji</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Anuluj
            </Button>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveProduct}
            >
              Dodaj produkt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
