import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'agent' | 'admin' | 'agency' | 'developer';
  phoneNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: (options: { redirectToLogin?: boolean }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { toast } = useToast();

  // Clear auth data from storage and state
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Set auth data in storage and state
  const setAuthData = useCallback((userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            // Try to get fresh user data
            const userData = await authApi.getMe();
            setUser(userData);
          } catch (error) {
            console.error('Failed to refresh session:', error);
            // If refresh fails but we have stored user, use it
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [clearAuthData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { user, token } = await authApi.login(email, password);
      setAuthData(user, token);
      
      toast({
        title: "წარმატებული შესვლა",
        description: `მოგესალმებით, ${user.fullName}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'შესვლა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.';
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      const { user, token } = await authApi.register(userData);
      setAuthData(user, token);
      
      toast({
        title: "რეგისტრაცია წარმატებით დასრულდა",
        description: `მოგესალმებით, ${user.fullName}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.';
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback((options: { redirectToLogin?: boolean } = {}) => {
    const { redirectToLogin = true } = options;
    clearAuthData();
    
    toast({
      title: "თქვენ გამოხვედით სისტემიდან",
      description: "დაგვიკავშირდით ნებისმიერ დროს!",
    });
    
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  }, [clearAuthData, toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};