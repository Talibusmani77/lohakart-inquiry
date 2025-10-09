import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface StatsProps {
  totalProducts: number;
  activeProducts: number;
  totalInquiries: number;
  pendingInquiries: number;
}

export function DashboardStats({
  totalProducts,
  activeProducts,
  totalInquiries,
  pendingInquiries,
}: StatsProps) {
  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Products',
      value: activeProducts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Inquiries',
      value: totalInquiries,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Pending Inquiries',
      value: pendingInquiries,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className="hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
