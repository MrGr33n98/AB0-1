import { useState, useEffect } from 'react';
import { Category } from '@/types'; // Make sure you have this type defined

// ... existing code ...

// This function is likely missing or not exported correctly
export const useCategory = (id: number) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/categories/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching category: ${response.status}`);
        }
        
        const data = await response.json();
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { category, loading, error };
};

// Your existing useCategories hook should be here