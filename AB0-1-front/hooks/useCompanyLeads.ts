'use client';

import { useState, useEffect } from 'react';
import { leadsApi, Lead } from '@/lib/api';

interface UseCompanyLeadsParams {
  companyId: number;
  status?: Lead['status'];
  limit?: number;
  page?: number;
}

export function useCompanyLeads({ companyId, status, limit = 10, page = 1 }: UseCompanyLeadsParams) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, [companyId, status, limit, page]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { limit, page };
      if (status) params.status = status;

      const response = await leadsApi.getByCompany(companyId, params);
      
      // O formato da resposta pode variar - vamos tratar os diferentes casos
      if (Array.isArray(response)) {
        setLeads(response);
        setTotal(response.length); // Este é um placeholder - a API real deve retornar informações de paginação
      } else if (response && response.leads) {
        setLeads(response.leads);
        setTotal(response.meta?.total_count || response.leads.length);
      } else {
        setLeads([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar leads');
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: Lead['status']) => {
    try {
      const response = await leadsApi.changeStatus(leadId, newStatus);
      // Atualizar o lead na lista local
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar status do lead');
      throw err;
    }
  };

  return {
    leads,
    loading,
    error,
    total,
    updateLeadStatus,
    refetch: fetchLeads,
  };
}