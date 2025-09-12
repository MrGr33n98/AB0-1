'use client';

import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';
import { Category } from './useCategories';

export function useCategory(id: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id || isNaN(id)) {
        setError('Invalid category ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await categoriesApi.getById(id);
        console.log('Category data:', data); // For debugging
        
        // Ensure products array exists even if API doesn't return it
        if (!data.products) {
          data.products = [];
        }
        
        // Ensure companies array exists even if API doesn't return it
        if (!data.companies) {
          data.companies = [];
        }
        
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
}
