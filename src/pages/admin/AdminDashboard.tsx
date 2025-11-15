import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading) {
      if (!user) {
        navigate('/auth/login');
      } else if (!isAdmin) {
        navigate('/');
      } else {
        fetchStats();
      }
    }
  }, [user, isAdmin, adminLoading, navigate]);

  const fetchStats = async () => {
    try {
      const [products, inquiries] = await Promise.all([
        supabase.from('products').select('active'),
        supabase.from('inquiries').select('status'),
      ]);

      setStats({
        totalProducts: products.data?.length || 0,
        activeProducts: products.data?.filter((p) => p.active).length || 0,
        totalInquiries: inquiries.data?.length || 0,
        pendingInquiries: inquiries.data?.filter((i) => i.status === 'open').length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || loading) {
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your products and inquiries
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/products/add')} 
              size="lg"
              className="hover-scale shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>

          <DashboardStats {...stats} />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start transition-all hover:translate-x-1"
                  onClick={() => navigate('/admin/products/add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start transition-all hover:translate-x-1"
                  onClick={() => navigate('/admin/products')}
                >
                  Manage Products
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start transition-all hover:translate-x-1"
                  onClick={() => navigate('/admin/inquiries')}
                >
                  View Inquiries
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingInquiries > 0
                    ? `You have ${stats.pendingInquiries} pending inquir${
                        stats.pendingInquiries === 1 ? 'y' : 'ies'
                      } to review.`
                    : 'All inquiries have been reviewed.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
