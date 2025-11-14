import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminInquiryDetail() {
  const { id } = useParams();
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inquiry, setInquiry] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdminAuthenticated) {
      navigate('/admin/login');
    } else if (isAdminAuthenticated) {
      fetchInquiryDetails();
    }
  }, [isAdminAuthenticated, adminLoading, navigate, id]);

  const fetchInquiryDetails = async () => {
    try {
      const { data: inquiryData, error: inquiryError } = await supabase
        .from('inquiries')
        .select(`
          *,
          profiles (name, email),
          inquiry_items (
            id,
            product_id,
            quantity,
            notes,
            products (title, sku, metal_type)
          )
        `)
        .eq('id', id)
        .single();

      if (inquiryError) throw inquiryError;
      setInquiry(inquiryData);

      const { data: repliesData, error: repliesError } = await (supabase as any)
        .from('inquiry_replies')
        .select('*')
        .eq('inquiry_id', id)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;
      setReplies(repliesData || []);
    } catch (error) {
      console.error('Error fetching inquiry details:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load inquiry details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const { error } = await (supabase as any)
        .from('inquiry_replies')
        .insert({
          inquiry_id: id,
          message: replyText.trim(),
        });

      if (error) throw error;

      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent to the customer',
      });

      setReplyText('');
      fetchInquiryDetails();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send reply',
      });
    } finally {
      setSending(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!inquiry) {
    return <div>Inquiry not found</div>;
  }

  const statusColors: Record<string, any> = {
    pending: 'secondary',
    processing: 'default',
    completed: 'default',
    cancelled: 'destructive',
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/inquiries')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Inquiry #{inquiry.inquiry_number}</h1>
              <p className="text-muted-foreground mt-2">
                Submitted on {format(new Date(inquiry.created_at), 'PPP')}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{inquiry.profiles?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{inquiry.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusColors[inquiry.status]} className="mt-1">
                      {inquiry.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products ({inquiry.inquiry_items?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inquiry.inquiry_items?.map((item: any, index: number) => (
                      <div key={item.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{item.products?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                SKU: {item.products?.sku} | {item.products?.metal_type}
                              </p>
                            </div>
                            <p className="text-sm font-medium">Qty: {item.quantity}</p>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground">
                              Notes: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversation ({replies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {replies.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No replies yet. Be the first to respond!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-accent/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">Admin</Badge>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(reply.created_at), 'PPp')}
                            </p>
                          </div>
                          <p className="text-sm mt-2">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      disabled={sending}
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyText.trim() || sending}
                      className="w-full"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/admin/inquiries')}
                  >
                    Back to Inquiries
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
