'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import CompanyCard from '@/components/CompanyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import SidebarFilter from '@/components/SidebarFilter';
import { extractLocations } from '@/utils/address';
import { useCategory } from '../CategoryContext';
import { ClientOnly } from '@/components/ClientOnly';

type Filters = {
  searchTerm: string;
  state: string | null;
  city: string | null;
  rating: number | null;
};

// mesma função usada no CompanyCard
const getFullImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CompaniesPage() {
  const { category } = useCategory();
  const categoryId = category?.id;

  const { companies, loading } = useCompaniesSafe(categoryId ? { category_id: categoryId } : {});
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    state: null,
    city: null,
    rating: null,
  });

  const locationsData = useMemo(() => extractLocations(companies), [companies]);

  const handleFilterChange = (type: string, value: any) => {
    if (type === 'clearAll') {
      setFilters({ searchTerm: '', state: null, city: null, rating: null });
    } else {
      setFilters(prev => ({ ...prev, [type]: prev[type] === value ? null : value }));
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      if (categoryId && c.category_id !== categoryId) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!c.name.toLowerCase().includes(term) && !c.description?.toLowerCase().includes(term)) return false;
      }
      if (filters.state && !c.address?.includes(filters.state)) return false;
      if (filters.city && !c.address?.includes(filters.city)) return false;
      if (filters.rating && (c.rating || 0) < filters.rating) return false;
      return true;
    });
  }, [companies, filters, categoryId]);

  // gera URL absoluta para o banner da categoria
  const categoryBannerUrl = getFullImageUrl(category?.banner_url);
  console.log('Category object:', category);
  console.log('Category banner URL:', categoryBannerUrl);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {category && (
              <div className="relative w-full h-48 bg-gray-300 rounded-lg overflow-hidden mb-8">
                {categoryBannerUrl ? (
                  <Image
                    src={categoryBannerUrl}
                    alt={`Banner da categoria ${category.name}`}
                    fill
                    className="brightness-75 object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">Banner não disponível</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg">
                    {category.name}
                  </h1>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold">Empresas</h2>
              <p className="text-gray-600">
                {loading ? '...' : filteredCompanies.length} empresas encontradas
              </p>
            </div>

            {/* Chips de filtros ativos */}
            <ClientOnly>
              <AnimatePresence>
              {(filters.searchTerm || filters.state || filters.city || filters.rating) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2 mb-6 items-center"
                >
                  {Object.entries(filters).map(([key, val]) =>
                    val ? (
                      <Badge
                        key={key}
                        onClick={() => handleFilterChange(key, null)}
                        className="bg-orange-500 text-white cursor-pointer"
                      >
                        {key}: {val} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ) : null
                  )}
                  <button
                    onClick={() => handleFilterChange('clearAll', null)}
                    className="text-sm text-gray-600 underline ml-2"
                  >
                    Limpar todos
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            </ClientOnly>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <p className="text-center py-20 text-gray-500">
                Nenhuma empresa encontrada.
              </p>
            ) : (
              <ClientOnly>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCompanies.map(c => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <CompanyCard company={c} />
                  </motion.div>
                ))}
              </motion.div>
            </ClientOnly>
            )}
          </div>

          <SidebarFilter
            onFilterChange={handleFilterChange}
            filters={filters}
            locationsData={locationsData}
          />
        </div>
      </div>
    </div>
  );
}
