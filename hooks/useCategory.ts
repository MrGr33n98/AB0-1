'use client';

import { useState, useEffect } from 'react';
import { Category, categoriesApi } from '@/lib/api';

export function useCategory(id: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoriesApi.getById(id);
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch category ${id}`));
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
