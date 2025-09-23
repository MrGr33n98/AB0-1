import { ReactNode } from 'react';
import { getCategoryById } from '@/utils/categories'; // Assuming a utility to fetch category by ID

type Props = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const categoryId = Number(params.id);
  const category = await getCategoryById(categoryId);

  return {
    title: category ? `${category.name} | Avalia Solar` : 'Empresas por Categoria | Avalia Solar',
    description: category
      ? `Veja todas as empresas de ${category.name} filtradas por categoria e região.`
      : 'Veja todas as empresas filtradas por categoria e região.',
  };
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}