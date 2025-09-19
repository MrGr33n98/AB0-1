'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/api';
import { categoriesApiSafe } from '@/lib/api-client';

export function useCategory(id: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoriesApiSafe.getById(id);
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Falha ao buscar categoria ${id}`));
        console.error(`Erro ao buscar categoria ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { category, loading, error };
}
