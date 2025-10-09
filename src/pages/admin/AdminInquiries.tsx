import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { InquiryTable } from '@/components/admin/InquiryTable';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminInquiries() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/auth/login');
      } else if (!isAdmin) {
        navigate('/');
      } else {
        fetchInquiries();
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          profiles (name),
          inquiry_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || roleLoading || loading) {
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
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Inquiries</h1>
            <p className="text-muted-foreground mt-2">
              Manage customer inquiries and requests
            </p>
          </div>

          <InquiryTable inquiries={inquiries} onRefresh={fetchInquiries} />
        </div>
      </main>
    </div>
  );
}
