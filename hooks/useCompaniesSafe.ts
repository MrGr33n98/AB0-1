'use client';

import { useState, useEffect } from 'react';
import { companiesApiSafe, Company } from '@/lib/api-client';

interface UseCompaniesSafeParams {
  status?: 'active' | 'inactive';
  featured?: boolean;
  category_id?: number;
  limit?: number;
}

export function useCompaniesSafe(params?: UseCompaniesSafeParams) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesApiSafe.getAll({
        ...params
      });
      
      // Não filtra por status e featured se não estiverem definidos
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    error,
    refetch: fetchCompanies,
  };
}

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
      setCompany(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company');
    } finally {
      setLoading(false);
    }
  };

  return { company, loading, error, refetch: () => fetchCompany(id) };
}