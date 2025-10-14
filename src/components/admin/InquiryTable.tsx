import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Inquiry {
  id: string;
  number: string;
  status: string;
  created_at: string;
  profiles: { name: string } | null;
  inquiry_items: any[];
}

interface InquiryTableProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'default',
  responded: 'secondary',
  negotiation: 'outline',
  closed: 'destructive',
};

export function InquiryTable({ inquiries, onRefresh }: InquiryTableProps) {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: status as 'open' | 'responded' | 'negotiation' | 'closed' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Inquiry updated',
        description: 'Status has been successfully updated.',
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inquiry status.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inquiry #</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No inquiries found.
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-medium">{inquiry.number}</TableCell>
                <TableCell>{inquiry.profiles?.name || 'Unknown'}</TableCell>
                <TableCell>{inquiry.inquiry_items.length} items</TableCell>
                <TableCell>{format(new Date(inquiry.created_at), 'PP')}</TableCell>
                <TableCell>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) => updateStatus(inquiry.id, value)}
                    disabled={updating === inquiry.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
