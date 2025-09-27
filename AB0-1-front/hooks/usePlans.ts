'use client';

import { useState, useEffect } from 'react';
import { plansApi, Plan } from '@/lib/api';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plansApi.getAll();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar planos');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return { plans, loading, error, refetch: fetchPlans };
}

export function usePlan(id: number) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlan(id);
    }
  }, [id]);

  const fetchPlan = async (planId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await plansApi.getById(planId);
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar plano');
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return { plan, loading, error, refetch: () => fetchPlan(id) };
}