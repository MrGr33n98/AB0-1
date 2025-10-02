import { Suspense } from 'react';
import CategoryClientComponent from './CategoryClientComponent';
import CategoryBanner from '@/components/CategoryBanner';
import { fetchCategoryBySlug, companiesApi } from '@/lib/api';
import { AlertCircle, Building2, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySlugPageProps {
  params: {
    slug: string;
  };
}

async function CategoryPageServer({ params }: CategorySlugPageProps) {
  try {
    const category = await fetchCategoryBySlug(params.slug);
    
    // Get companies for this category
    const companies = await companiesApi.getAll({ 
      category_id: category.id,
      status: 'active'
    });

    // Pass the initial data to the client component
    return <CategoryClientComponent initialCategory={category} initialCompanies={companies || []} />;
  } catch (error) {
    // Error state
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Categoria não encontrada
            </h1>
            <p className="text-gray-600 mb-6">
              A categoria "{params.slug}" não existe ou foi removida.
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => window.history.back()}
              >
                Voltar
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/categories'}
              >
                Ver todas as categorias
              </Button>
            </div>
            <p className="mt-4 text-sm text-red-600">Erro: {(error as Error).message}</p>
          </motion.div>
        </div>
      </div>
    );
  }
}

export default CategoryPageServer;