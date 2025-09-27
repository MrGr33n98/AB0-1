'use client';

import { useState, useEffect } from 'react';
import { dashboardApi, DashboardStats } from '@/lib/api';

export interface ExtendedDashboardStats extends DashboardStats {
  active_campaigns?: number;
  monthly_revenue?: number;
  leads_count?: number;
  reviews_count?: number;
  products_count?: number;
  companies_count?: number;
  average_rating?: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<ExtendedDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tenta primeiro obter estatísticas diretamente da API
      try {
        const data = await dashboardApi.getStats();
        
        // Extend the data with additional calculated fields if needed
        const extendedData: ExtendedDashboardStats = {
          ...data,
          // Ensure all fields are present even if API doesn't return them
          companies_count: data.companies_count ?? 0,
          products_count: data.products_count ?? 0,
          leads_count: data.leads_count ?? 0,
          reviews_count: data.reviews_count ?? 0,
          active_campaigns: data.active_campaigns ?? 0,
          monthly_revenue: data.monthly_revenue ?? 0,
        };
        
        setStats(extendedData);
        return; // Retorna se obter sucesso
      } catch (apiError) {
        console.log('Dashboard API failed, falling back to alternative calculation:', apiError);
      }
      
      // Se o endpoint de estatísticas não estiver disponível, calcular estatísticas a partir dos dados públicos
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Buscar empresas
      const companiesResponse = await fetch(`${baseUrl}/api/v1/companies`);
      // Buscar avaliações
      const reviewsResponse = await fetch(`${baseUrl}/api/v1/reviews`);
      // Buscar produtos
      const productsResponse = await fetch(`${baseUrl}/api/v1/products`);
      
      // Processar as respostas
      let companiesData, reviewsData, productsData;
      let companies = [];
      let reviews = [];
      let products = [];
      
      if (companiesResponse.ok) {
        companiesData = await companiesResponse.json();
        companies = Array.isArray(companiesData) ? companiesData : companiesData.companies || [];
      }
      
      if (reviewsResponse.ok) {
        reviewsData = await reviewsResponse.json();
        reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [];
      }
      
      if (productsResponse.ok) {
        productsData = await productsResponse.json();
        products = Array.isArray(productsData) ? productsData : productsData.products || [];
      }
      
      // Calcular estatísticas reais a partir dos dados
      const companiesCount = companies.length;
      
      // Calcular média de avaliações válidas
      const validRatings = companies
        .map(c => c.rating_avg || c.rating)
        .filter(r => r && r > 0);
      
      const averageRating = validRatings.length > 0
        ? (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length)
        : 0;
      
      // Contar avaliações totais (usando rating_count ou contando avaliações se disponíveis)
      const totalReviews = companies.reduce((sum, company) => {
        return sum + (company.rating_count || 0);
      }, 0);
      
      const calculatedStats: ExtendedDashboardStats = {
        companies_count: companiesCount,
        products_count: products.length,
        leads_count: 0, // Não temos endpoint público para leads
        reviews_count: totalReviews,
        active_campaigns: 0, // Não temos endpoint para campanhas
        monthly_revenue: 0, // Não temos endpoint para receita
        // Adicionar campos extras que o Hero component espera
        average_rating: averageRating,
      };
      
      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      console.error('Error in dashboard hook:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}