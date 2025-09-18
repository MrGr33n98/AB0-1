// app/categories/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import { useCategories } from '@/hooks/useCategories';
import CompanyCard from '@/components/CompanyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SidebarFilter from '@/components/SidebarFilter';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const { companies, loading: companiesLoading } = useCompaniesSafe();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    category: searchParams.get('category') || null,
    state: searchParams.get('state') || null,
    city: searchParams.get('city') || null,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : null,
  });

  // Group companies by category
  const companiesByCategory = useMemo(() => {
    if (!companies || !categories) return {};
    
    return companies.reduce((acc, company) => {
      const category = categories.find(cat => cat.id === company.category_id);
      if (category) {
        if (!acc[category.name]) {
          acc[category.name] = [];
        }
        acc[category.name].push(company);
      }
      return acc;
    }, {});
  }, [companies, categories]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      }
    });
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  // Improved location data extraction with validation
  const locationsData = useMemo(() => {
    if (!companies?.length) return {};
    
    return companies.reduce((acc, company) => {
      if (!company.address) return acc;
      
      try {
        const addressParts = company.address.split(',').map(part => part.trim());
        if (addressParts.length < 2) return acc;
        
        const state = addressParts[addressParts.length - 1];
        const city = addressParts[addressParts.length - 2];
        
        if (!state || !city) return acc;
        
        if (!acc[state]) {
          acc[state] = new Set();
        }
        acc[state].add(city);
      } catch (error) {
        console.error('Error parsing address:', error);
      }
      
      return acc;
    }, {});
  }, [companies]);

  // Improved filter handling with type safety
  const handleFilterChange = (filterType: string, value: any) => {
    if (filterType === 'clearAll') {
      setFilters({
        searchTerm: '',
        category: null,
        state: null,
        city: null,
        rating: null,
      });
      return;
    }

    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [filterType]: value,
        // Reset dependent filters
        ...(filterType === 'state' && { city: null }),
        ...(filterType === 'category' && { rating: null }),
      };

      // Validate rating value
      if (filterType === 'rating' && value !== null) {
        newFilters.rating = Math.min(Math.max(1, Number(value)), 5);
      }

      return newFilters;
    });
  };

  // Enhanced company filtering with error handling
  const filteredCompanies = useMemo(() => {
    if (!companies?.length || !categories?.length) return [];

    try {
      return companies.filter(company => {
        // Category filter
        if (filters.category) {
          const companyCategory = categories.find(cat => cat.id === company.category_id);
          if (!companyCategory || companyCategory.name !== filters.category) {
            return false;
          }
        }

        // Search term filter
        if (filters.searchTerm) {
          const searchTermLower = filters.searchTerm.toLowerCase();
          const matchesName = (company.name || '').toLowerCase().includes(searchTermLower);
          const matchesDescription = (company.description || '').toLowerCase().includes(searchTermLower);
          if (!matchesName && !matchesDescription) {
            return false;
          }
        }

        // Location filters with improved validation
        if (company.address && (filters.state || filters.city)) {
          try {
            const addressParts = company.address.split(',').map(part => part.trim());
            const companyState = addressParts[addressParts.length - 1];
            const companyCity = addressParts[addressParts.length - 2];

            if (filters.state && companyState !== filters.state) return false;
            if (filters.city && companyCity !== filters.city) return false;
          } catch (error) {
            console.error('Error parsing company address:', error);
            return false;
          }
        }

        // Rating filter with validation
        if (filters.rating !== null) {
          const rating = Number(company.rating) || 0;
          if (isNaN(rating) || rating < filters.rating) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Error filtering companies:', error);
      return [];
    }
  }, [companies, categories, filters]);

  // Loading state management
  const loading = companiesLoading || categoriesLoading;

  // Filter labels for display
  const getFilterLabel = (key: string, value: any): string => {
    switch (key) {
      case 'searchTerm':
        return `Busca: ${value}`;
      case 'category':
        return `Categoria: ${value}`;
      case 'state':
        return `Estado: ${value}`;
      case 'city':
        return `Cidade: ${value}`;
      case 'rating':
        return `${value} estrelas ou mais`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <SidebarFilter 
            onFilterChange={handleFilterChange} 
            filters={filters} 
            locationsData={locationsData}
          />

          <div className="flex-1">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {filters.category || 'Todas as Categorias'}
              </h1>
              <p className="text-gray-600 mt-2 md:mt-0">
                <span className="font-semibold text-orange-600">
                  {loading ? '...' : filteredCompanies.length}
                </span> Empresas encontradas
              </p>
            </div>

            {/* Active Filters */}
            <AnimatePresence>
              {Object.entries(filters).some(([_, value]) => Boolean(value)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <Badge 
                        key={key}
                        variant="default"
                        className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                        onClick={() => handleFilterChange(key, null)}
                      >
                        {getFilterLabel(key, value)} <X className="ml-2 h-3 w-3" />
                      </Badge>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Companies Grid with Error Boundary */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">
                  Nenhuma empresa encontrada com os filtros selecionados.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredCompanies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CompanyCard company={company} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}