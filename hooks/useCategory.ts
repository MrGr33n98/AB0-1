'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, Category } from '@/lib/api';

export function useCategory(id: number | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getById(categoryId);
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchCategory(id);
  }, [id, fetchCategory]);

  return { category, loading, error, refetch: () => id && fetchCategory(id) };
}
