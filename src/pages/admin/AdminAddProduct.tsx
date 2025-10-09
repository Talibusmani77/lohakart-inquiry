import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminAddProduct() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    metal_type: '',
    category: '',
    grade: '',
    stock_qty: 0,
    min_order_qty: 1,
    active: true,
  });

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/auth/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slug = generateSlug(formData.title);
      
      const { error } = await supabase.from('products').insert({
        ...formData,
        slug,
      });

      if (error) throw error;

      toast({
        title: 'Product added',
        description: 'The product has been successfully created.',
      });
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Add Product</h1>
            <p className="text-muted-foreground mt-2">
              Create a new product in your catalog
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      required
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="e.g., MS-PLATE-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., MS Plate 10mm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metal_type">Metal Type *</Label>
                    <Select
                      value={formData.metal_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, metal_type: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ferrous">Ferrous</SelectItem>
                        <SelectItem value="non-ferrous">Non-Ferrous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coil">Coil</SelectItem>
                        <SelectItem value="sheet">Sheet</SelectItem>
                        <SelectItem value="plate">Plate</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="rod">Rod</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      placeholder="e.g., 304, 316"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_qty">Stock Quantity</Label>
                    <Input
                      id="stock_qty"
                      type="number"
                      min="0"
                      value={formData.stock_qty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock_qty: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min_order_qty">Minimum Order Quantity</Label>
                    <Input
                      id="min_order_qty"
                      type="number"
                      min="1"
                      value={formData.min_order_qty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_qty: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/products')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
