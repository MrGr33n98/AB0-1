'use client';

import { useState, useEffect } from 'react';
import { companiesApiSafe, Company } from '@/lib/api-client';

interface UseCompaniesSafeParams {
  status?: 'active' | 'inactive';
  featured?: boolean;
  category_id?: number;
  limit?: number;
}

// Hook para lista de empresas
export function useCompaniesSafe(params?: UseCompaniesSafeParams) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [
    params?.status,
    params?.featured,
    params?.category_id,
    params?.limit
  ]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await companiesApiSafe.getAll({
        status: params?.status || 'active',
        featured: params?.featured ?? true,
        sort: 'rating',
        limit: params?.limit || 12,
        category_id: params?.category_id,
      });

      // 🔑 Normaliza o retorno
      const companiesArray = Array.isArray(data) ? data : data?.companies || [];

      setCompanies(companiesArray);
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
      setError(err instanceof Error ? err.message : 'Falha ao carregar empresas');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  return { companies, loading, error, refetch: fetchCompanies };
}

// Hook para logos de parceiros
export function usePartnerLogos() {
  const [partners, setPartners] = useState<Array<Pick<Company, 'id' | 'name' | 'logo_url'>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await companiesApiSafe.getAll({
          verified: true,
          featured: true,
          status: 'active',
          limit: 5,
          sort: 'rating',
        });

        const companiesArray = Array.isArray(data) ? data : data?.companies || [];

        const partnerLogos = companiesArray
          .filter(c => c.status === 'active' && c.logo_url)
          .map(({ id, name, logo_url }) => ({ id, name, logo_url }));

        setPartners(partnerLogos);
      } catch (err) {
        console.error('Erro ao buscar logos dos parceiros:', err);
        setError(err instanceof Error ? err.message : 'Falha ao carregar logos dos parceiros');
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, loading, error };
}

// Hook para empresa única
export function useCompanySafe(id: number) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await companiesApiSafe.getById(companyId);

      // 🔑 Normaliza o retorno
      setCompany(data?.company || data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar empresa');
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  return { company, loading, error, refetch: () => fetchCompany(id) };
}
