'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response: any = await authApi.login(email, password);

      // Persist token (real or mock)
      if (typeof window !== 'undefined' && response?.token) {
        localStorage.setItem('auth_token', response.token);
      }

      // Normal case: API returns user
      if (response?.user) {
        setUser(response.user);
        return;
      }

      // Try to fetch current user after login (if login endpoint sets session cookie)
      try {
        const me = await authApi.me();
        setUser(me);
        return;
      } catch (e) {
        // Fallback: use response data or create mock user
        if (response?.mocked) {
          // If backend returned mocked data, use it
          const mockUser = {
            id: response.user?.id || 1,
            name: response.user?.name || 'Usuário Demo',
            email: response.user?.email || email,
            role: (response.user?.role as 'user' | 'admin' | 'company') || 'user',
            created_at: response.user?.created_at || new Date().toISOString(),
            updated_at: response.user?.updated_at || new Date().toISOString()
          };
          setUser(mockUser);
        } else {
          throw new Error('Failed to get user data');
        }
      }
    } catch (error) {
      console.error('[Auth] Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}