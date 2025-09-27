// contexts/CompanyAuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Company } from '@/lib/api';

interface CompanyAuthContextType {
  company: Company | null;
  loading: boolean;
  isPremium: boolean;
  canAccessLeads: boolean;
  canEditProfile: boolean;
  canUseWhatsApp: boolean;
  canUseCustomCTAs: boolean;
  refreshCompany: () => void;
}

const CompanyAuthContext = createContext<CompanyAuthContextType | undefined>(undefined);

export function CompanyAuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar informações da empresa quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'company' || user.id)) {
      loadCompanyData();
    } else {
      setCompany(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      // Aqui você pode implementar a lógica para buscar os dados da empresa
      // Por enquanto, vamos simular com um fetch
      // const companyData = await fetchCompanyByUserId(user.id);
      // setCompany(companyData);
    } catch (error) {
      console.error('Error loading company data:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompany = () => {
    if (isAuthenticated && user) {
      loadCompanyData();
    }
  };

  // Verificar se a empresa tem plano premium
  const isPremium = company?.plan_id && company.plan_id > 1; // Assumindo que o plano 1 é o básico

  // Permissões baseadas no plano
  const canAccessLeads = isPremium || company?.verified; // Empresas verificadas também podem acessar leads
  const canEditProfile = isPremium;
  const canUseWhatsApp = isPremium;
  const canUseCustomCTAs = isPremium;

  const value = {
    company,
    loading: loading || authLoading,
    isPremium,
    canAccessLeads,
    canEditProfile,
    canUseWhatsApp,
    canUseCustomCTAs,
    refreshCompany,
  };

  return (
    <CompanyAuthContext.Provider value={value}>
      {children}
    </CompanyAuthContext.Provider>
  );
}

export function useCompanyAuth() {
  const context = useContext(CompanyAuthContext);
  if (context === undefined) {
    throw new Error('useCompanyAuth must be used within a CompanyAuthProvider');
  }
  return context;
}