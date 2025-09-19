'use client';

import { useState } from 'react';
import { searchApi, Company, Product, Article } from '@/lib/api';

export interface SearchResults {
  companies: Company[];
  products: Product[];
  articles: Article[];
}

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({
    companies: [],
    products: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults({ companies: [], products: [], articles: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [companies, products, articles] = await Promise.all([
        searchApi.companies(query),
        searchApi.products(query),
        searchApi.articles(query),
      ]);

      setResults({ companies, products, articles });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getTotalResults = () => {
    return results.companies.length + results.products.length + results.articles.length;
  };

  return {
    results,
    loading,
    error,
    search,
    getTotalResults,
  };
}