import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    setIsAdminAuthenticated(adminAuth === 'true');
    setAdminLoading(false);
  }, []);

  const adminLogin = async (username: string, password: string) => {
    try {
      const { data: credentials, error } = await (supabase as any)
        .from('admin_credentials')
        .select('password_hash')
        .eq('username', username)
        .maybeSingle();

      if (error || !credentials) {
        return { success: false, error: 'Invalid username or password' };
      }

      const isValid = await bcrypt.compare(password, (credentials as any).password_hash);
      
      if (!isValid) {
        return { success: false, error: 'Invalid username or password' };
      }

      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const adminLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLoading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
