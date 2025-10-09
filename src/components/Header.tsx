import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Menu, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInquiryCart } from '@/hooks/useInquiryCart';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useState } from 'react';

export function Header() {
  const { user, signOut } = useAuth();
  const { itemCount } = useInquiryCart();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">LK</span>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block text-foreground">
              LohaKart
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">
              Products
            </Link>
            <Link to="/pricing-index" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing Index
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, grades..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/inquiry/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth/login')} size="sm">
                Login
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link
                    to="/products"
                    className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    to="/pricing-index"
                    className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing Index
                  </Link>
                  <Link
                    to="/about"
                    className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="px-4">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}