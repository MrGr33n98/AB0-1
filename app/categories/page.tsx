// app/categories/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import { useCategories } from '@/hooks/useCategories';
import CompanyCard from '@/components/CompanyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import SidebarFilter from '@/components/SidebarFilter'; // Importação do componente
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Função para extrair estados e cidades únicos das empresas
const extractLocations = (companies) => {
  const locations = companies.reduce((acc, company) => {
    if (company.address) {
      const addressParts = company.address.split(',').map(part => part.trim());
      const state = addressParts[addressParts.length - 1];
      const city = addressParts[addressParts.length - 2];

      if (state && city) {
        if (!acc[state]) {
          acc[state] = new Set();
        }
        acc[state].add(city);
      }
    }
    return acc;
  }, {});

  // Converter Sets para arrays
  return Object.fromEntries(
    Object.entries(locations).map(([state, cities]) => [
      state,
      Array.from(cities).sort()
    ])
  );
};

export default function CompaniesPage() {
  const { companies, loading } = useCompaniesSafe();
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: null,
    state: null,
    city: null,
    rating: null,
  });

  // Extrair estados e cidades dos dados das empresas
  const locationsData = useMemo(() => extractLocations(companies), [companies]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clearAll') {
      setFilters({ searchTerm: '', category: null, state: null, city: null, rating: null });
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: prevFilters[filterType] === value ? null : value,
      }));
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Filtrar por termo de busca
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const companyNameLower = company.name.toLowerCase();
        const companyDescriptionLower = company.description?.toLowerCase();
        
        if (!companyNameLower.includes(searchTermLower) && 
            (companyDescriptionLower && !companyDescriptionLower.includes(searchTermLower))) {
          return false;
        }
      }

      // Filtrar por estado e cidade usando o endereço completo
      if (company.address) {
        const addressParts = company.address.split(',').map(part => part.trim());
        const companyState = addressParts[addressParts.length - 1];
        const companyCity = addressParts[addressParts.length - 2];

        if (filters.state && companyState !== filters.state) {
          return false;
        }
        if (filters.city && companyCity !== filters.city) {
          return false;
        }
      } else if (filters.state || filters.city) {
        return false;
      }
      
      // Filtrar por avaliação usando a propriedade real de rating
      if (filters.rating && company.rating) {
        if (company.rating < filters.rating) {
          return false;
        }
      }
      
      return true;
    });
  }, [companies, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Empresas</h1>
              <p className="text-gray-600 mt-2 md:mt-0">
                <span className="font-semibold text-orange-600">
                  {loading ? '...' : filteredCompanies.length}
                </span> Empresas encontradas
              </p>
            </div>
            
            <AnimatePresence>
              {(filters.searchTerm || filters.category || filters.state || filters.city || filters.rating) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {filters.searchTerm && (
                    <Badge 
                      variant="default"
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange('searchTerm', '')}
                    >
                      Busca: {filters.searchTerm} <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge 
                      variant="default"
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange('category', null)}
                    >
                      Categoria: {filters.category} <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {filters.state && (
                    <Badge 
                      variant="default"
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange('state', null)}
                    >
                      Estado: {filters.state} <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {filters.city && (
                    <Badge 
                      variant="default"
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange('city', null)}
                    >
                      Cidade: {filters.city} <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {filters.rating && (
                    <Badge 
                      variant="default"
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange('rating', null)}
                    >
                      Avaliação: {filters.rating}+ <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">Nenhuma empresa encontrada com os filtros selecionados.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredCompanies.map((company) => (
                  <motion.div key={company.id} variants={itemVariants}>
                    <CompanyCard company={company} />
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