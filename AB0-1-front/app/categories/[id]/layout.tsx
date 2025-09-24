import { ReactNode } from 'react';
import { getCategoryById, getCategoryBySlug } from '@/utils/categories'; // Fetch category by ID or slug
import { CategoryProvider } from '../CategoryContext';
import { Category } from '@/lib/api';

type Props = {
  children: ReactNode;
  params: { id: string }; // Using ID parameter
};

export async function generateMetadata({ params }: Props) {
  let category: Category | null = null;
  if (!isNaN(Number(params.id))) {
    category = await getCategoryById(Number(params.id));
  } else {
    category = await getCategoryBySlug(params.id);
  }

  return {
    title: category ? `${category.name} | Avalia Solar` : 'Empresas por Categoria | Avalia Solar',
    description: category
      ? `Veja todas as empresas de ${category.name} filtradas por categoria e região.`
      : 'Veja todas as empresas filtradas por categoria e região.',
  };
}

export default async function CategoryLayout({ children, params }: Props) {
  let category: Category | null = null;
  try {
    if (!isNaN(Number(params.id))) {
      category = await getCategoryById(Number(params.id));
    } else {
      category = await getCategoryBySlug(params.id);
    }

    if (!category) {
      console.error(`Category not found for id/slug: ${params.id}`);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
  }

  return (
    <CategoryProvider category={category}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </CategoryProvider>
  );
}