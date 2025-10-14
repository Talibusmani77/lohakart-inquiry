import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useInquiryCart } from '@/hooks/useInquiryCart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  title: string;
  metal_type: string;
  category: string;
  grade: string;
  specs: any;
  images: string[];
  datasheets: string[];
  stock_qty: number;
  min_order_qty: number;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [uom, setUom] = useState('kg');
  const { addItem } = useInquiryCart();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) throw error;
      setProduct(data);
      if (data.min_order_qty) {
        setQty(data.min_order_qty);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Product not found',
        variant: 'destructive',
      });
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToInquiry = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      title: product.title,
      sku: product.sku,
      qty,
      uom,
      specs: product.specs,
      imageUrl: product.images?.[0],
    });

    toast({
      title: 'Added to inquiry cart',
      description: `${product.title} has been added to your inquiry`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="h-24 w-24 text-muted-foreground" />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">{product.metal_type}</Badge>
              {product.category && <Badge variant="outline">{product.category}</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
            {product.grade && <p className="text-muted-foreground">Grade: {product.grade}</p>}
          </div>

          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reference Price</p>
                  <p className="text-2xl font-bold text-primary">₹ On Request</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Indicative price. Final price confirmed on inquiry.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(product.min_order_qty, parseInt(e.target.value) || 0))}
                      min={product.min_order_qty}
                      className="flex-1"
                    />
                    <select
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                      className="px-3 rounded-md border border-input bg-background"
                    >
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                  {product.min_order_qty > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Min. order quantity: {product.min_order_qty} {uom}
                    </p>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Inquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add to Inquiry Cart</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Adding {qty} {uom} of {product.title} to your inquiry cart.
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => {
                          handleAddToInquiry();
                          navigate('/inquiry/cart');
                        }}
                      >
                        Add & View Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleAddToInquiry}
                      >
                        Add & Continue Shopping
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            {product.datasheets && product.datasheets.length > 0 && (
              <TabsTrigger value="datasheets">Datasheets</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  High-quality {product.metal_type.toLowerCase()} {product.category?.toLowerCase()} suitable for various industrial applications.
                  Contact us for detailed specifications and pricing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {product.specs && typeof product.specs === 'object' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-muted-foreground">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Contact us for detailed specifications.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {product.datasheets && product.datasheets.length > 0 && (
            <TabsContent value="datasheets" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {product.datasheets.map((sheet, idx) => (
                      <a
                        key={idx}
                        href={sheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        Download Datasheet {idx + 1}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}