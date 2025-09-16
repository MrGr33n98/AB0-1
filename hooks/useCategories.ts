import { useState, useEffect } from 'react';
import { Category, categoriesApi } from '@/lib/api';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesApi.getAll(); // 👈 agora usa categoriesApi
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Falha ao buscar categorias'));
        console.error('Erro ao buscar categorias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
