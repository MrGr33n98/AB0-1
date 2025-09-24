'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { CategoryProvider } from './CategoryContext';
import { useCategory } from '@/hooks/useCategory';

export default function CategoryLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const identifier = params.slug || (params.id ? Number(params.id) : null);
  const { category, loading } = useCategory(identifier || 0);

  return (
    <CategoryProvider category={category}>
      {loading ? <div>Loading...</div> : children}
    </CategoryProvider>
  );
}