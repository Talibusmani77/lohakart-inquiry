import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Inquiry {
  id: string;
  number: string;
  status: string;
  created_at: string;
  inquiry_items: { qty: number; uom: string; products: { title: string } }[];
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    } else if (user) {
      fetchInquiries();
    }
  }, [user, authLoading, navigate]);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          inquiry_items (
            qty,
            uom,
            products (
              title
            )
          )
        `)
        .eq('buyer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'responded':
        return 'default';
      case 'negotiation':
        return 'secondary';
      case 'closed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>

      <Tabs defaultValue="inquiries" className="w-full">
        <TabsList>
          <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries" className="mt-6">
          {inquiries.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No inquiries yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by browsing products and adding them to your inquiry cart
                </p>
                <Button onClick={() => navigate('/products')}>Browse Products</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(inquiry.status)}
                          {inquiry.number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(inquiry.created_at), 'PPP')}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(inquiry.status) as any}>
                        {inquiry.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">Items:</p>
                      {inquiry.inquiry_items.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          • {item.qty} {item.uom} of {item.products.title}
                        </p>
                      ))}
                      {inquiry.inquiry_items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          + {inquiry.inquiry_items.length - 3} more items
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                  <p>{user?.created_at && format(new Date(user.created_at), 'PPP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}