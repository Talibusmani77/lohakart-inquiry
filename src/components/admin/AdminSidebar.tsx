import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  TrendingUp,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inquiries', href: '/admin/inquiries', icon: FileText },
  { name: 'Price Index', href: '/admin/prices', icon: TrendingUp },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r min-h-screen sticky top-16 hidden lg:block">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-accent hover:scale-105',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
