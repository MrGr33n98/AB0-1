'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { companiesApi } from '@/lib/api';
import { Plan } from '@/lib/api';

export interface CompanyPermissions {
  isPremium: boolean;
  canAccessLeads: boolean;
  canEditProfile: boolean;
  canUseWhatsApp: boolean;
  canUseCustomCTAs: boolean;
  canManageTeam: boolean;
  planFeatures: string[];
  planName: string;
  planExpiresAt?: string;
}

export function useCompanyPermissions() {
  const { user, isAuthenticated } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [permissions, setPermissions] = useState<CompanyPermissions>({
    isPremium: false,
    canAccessLeads: false,
    canEditProfile: false,
    canUseWhatsApp: false,
    canUseCustomCTAs: false,
    canManageTeam: false,
    planFeatures: [],
    planName: 'Free',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && user.role === 'company') {
      loadCompanyPermissions();
    } else {
      setPermissions({
        isPremium: false,
        canAccessLeads: false,
        canEditProfile: false,
        canUseWhatsApp: false,
        canUseCustomCTAs: false,
        canManageTeam: false,
        planFeatures: [],
        planName: 'Free',
      });
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadCompanyPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar informações da empresa pelo ID do usuário
      // Nota: precisaremos adaptar isso para buscar a empresa associada ao usuário
      // Supondo que a empresa pode ser identificada de outra forma
      console.log('Carregando permissões da empresa para o usuário:', user);
      
      // Simulando dados de exemplo
      const mockCompany = {
        id: 1,
        name: 'Sua Empresa',
        plan_id: 2, // Premium
        plan_name: 'Premium',
        plan_features: ['leads_access', 'profile_edit', 'whatsapp_integration', 'custom_ctas', 'team_management'],
        plan_expires_at: '2024-12-31',
        verified: true,
        profile_complete: true,
      };

      setCompany(mockCompany);

      // Determinar permissões com base no plano
      const isPremium = mockCompany.plan_id && mockCompany.plan_id > 1;
      const planFeatures = mockCompany.plan_features || [];

      setPermissions({
        isPremium,
        canAccessLeads: isPremium || mockCompany.verified,
        canEditProfile: isPremium,
        canUseWhatsApp: isPremium,
        canUseCustomCTAs: isPremium,
        canManageTeam: isPremium && planFeatures.includes('team_management'),
        planFeatures,
        planName: mockCompany.plan_name || 'Free',
        planExpiresAt: mockCompany.plan_expires_at,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar permissões');
      console.error('Erro ao carregar permissões:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPermissions = () => {
    if (isAuthenticated && user && user.role === 'company') {
      loadCompanyPermissions();
    }
  };

  return {
    permissions,
    loading,
    error,
    refreshPermissions,
  };
}