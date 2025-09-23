import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CategoriesClient from './CategoriesClient';

export const metadata = {
  title: 'Categorias | Avalia Solar',
  description: 'Encontre e compare empresas de energia solar em diversas categorias.',
};

export default function CategoriesPage() {
  return (
    <>
      <h1 className="sr-only">Categorias</h1>
      <Suspense
        fallback={
          <div className="container mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          </div>
        }
      >
        <CategoriesClient />
      </Suspense>
    </>
  );
}
