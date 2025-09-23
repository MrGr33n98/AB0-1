'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import CompanyCard from '@/components/CompanyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import SidebarFilter from '@/components/SidebarFilter';
import { useParams } from 'next/navigation';
import { extractLocations } from '@/utils/address';



type Filters = {
  searchTerm: string;
  state: string | null;
  city: string | null;
  rating: number | null;
};

export default function CompaniesPage() {
  const params = useParams();
  const categoryId = params.id ? Number(params.id) : null;

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
  }, [companies, filters]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="sr-only">Empresas por Categoria</h1>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-extrabold">Empresas</h1>
              <p className="text-gray-600">
                {loading ? '...' : filteredCompanies.length} empresas encontradas
              </p>
            </div>

            {/* Chips de filtros ativos */}
            <AnimatePresence>
              {(filters.searchTerm || filters.state || filters.city || filters.rating) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-6 items-center">
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <p className="text-center py-20 text-gray-500">Nenhuma empresa encontrada.</p>
            ) : (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCompanies.map(c => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <CompanyCard company={c} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          <SidebarFilter onFilterChange={handleFilterChange} filters={filters} />
        </div>
      </div>
    </div>
  );
}
