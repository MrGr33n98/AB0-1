'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, Category } from '@/lib/api';
import { categoriesApiSafe } from '@/lib/api-client';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApiSafe.getAll();
      const activeCategories = data.filter(category => 
        category.status === 'active'
      );
      setCategories(activeCategories || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to load categories'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCategories = useCallback(async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await categoriesApi.search(term);
      setCategories(results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err : new Error('Search failed'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchCategories(term);
    } else {
      loadCategories();
    }
  }, [loadCategories, searchCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    searchTerm,
    handleSearch,
    refresh: loadCategories
  };
}
