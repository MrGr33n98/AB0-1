'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Search, X, ChevronLeft } from 'lucide-react';

// Importe seus hooks e componentes
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import CompanyCard from '@/components/CompanyCard';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/hooks/useCategory';
import SidebarFilter from '@/components/SidebarFilter';

// Tipagem básica para Company e Product (ajuste conforme suas interfaces reais)
interface Company {
  id: number;
  name: string;
  description?: string;
  rating?: number;
  state?: string;
  city?: string;
  type?: 'private' | 'professional';
  logo_url?: string;
  banner_url?: string;
  featured?: boolean;
  // ... outras propriedades
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  rating?: number;
  state?: string;
  city?: string;
  image_url?: string;
  // ... outras propriedades
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = parseInt(params.id as string);

  // --- 1. Chamadas de Hooks de Dados ---
  const { category, loading: categoryLoading, error } = useCategory(categoryId);
  const { companies: allCompanies, loading: companiesLoading } = useCompanies();
  const { products: allProducts, loading: productsLoading } = useProducts();

  // --- 2. Chamadas de Hooks de Estado ---
  const [filters, setFilters] = useState(() => ({
    searchTerm: '',
    sortBy: 'mostRelevant',
    viewMode: 'grid',
    activeTab: 'companies',
    state: null,
    city: null,
    rating: null,
    minPrice: null,
    maxPrice: null,
    announcerType: 'all',
  }));

  // --- 3. Chamadas de Hooks de Callback ---
  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setFilters(prevFilters => {
      if (filterType === 'clearAll') {
        return {
          ...prevFilters,
          searchTerm: '',
          sortBy: 'mostRelevant',
          state: null,
          city: null,
          rating: null,
          minPrice: null,
          maxPrice: null,
          announcerType: 'all',
        };
      } else if (filterType === 'state' && prevFilters.state !== value) {
        return {
          ...prevFilters,
          state: value,
          city: null, // Limpa a cidade ao mudar o estado
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: value,
        };
      }
    });
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // --- 5. Chamadas de Hooks de Memorização ---
  const relatedCompanyIds = useMemo(() => new Set(category?.companies?.map(c => c.id)), [category]);
  const relatedProductIds = useMemo(() => new Set(category?.products?.map(p => p.id)), [category]);

  const companiesInCategory: Company[] = useMemo(() => {
    if (!allCompanies) return [];
    return allCompanies.filter(company => relatedCompanyIds.has(company.id));
  }, [allCompanies, relatedCompanyIds]);

  const productsInCategory: Product[] = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(product => relatedProductIds.has(product.id));
  }, [allProducts, relatedProductIds]);

  const filteredCompanies: Company[] = useMemo(() => {
    let currentCompanies = companiesInCategory;

    if (filters.searchTerm) {
      currentCompanies = currentCompanies.filter(company =>
        (company.name && company.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (company.description && company.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    
    // FILTROS DE ESTADO E CIDADE ATIVADOS
    if (filters.state) {
        currentCompanies = currentCompanies.filter(c => c.state === filters.state);
    }
    if (filters.city) {
        currentCompanies = currentCompanies.filter(c => c.city === filters.city);
    }
    // FIM DOS FILTROS DE ESTADO E CIDADE

    if (filters.rating) {
        currentCompanies = currentCompanies.filter(c => (c.rating || 0) >= filters.rating);
    }
    if (filters.announcerType && filters.announcerType !== 'all') {
      currentCompanies = currentCompanies.filter(company => company.type === filters.announcerType);
    }

    return currentCompanies.sort((a, b) => {
      if (!a || !b || !a.name || !b.name) return 0;
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [companiesInCategory, filters]);

  const filteredProducts: Product[] = useMemo(() => {
    let currentProducts = productsInCategory;

    if (filters.searchTerm) {
      currentProducts = currentProducts.filter(product =>
        (product.name && product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // FILTROS DE ESTADO E CIDADE ATIVADOS (assumindo que o produto tem sua própria localização)
    if (filters.state) {
        currentProducts = currentProducts.filter(p => p.state === filters.state);
    }
    if (filters.city) {
        currentProducts = currentProducts.filter(p => p.city === filters.city);
    }
    // FIM DOS FILTROS DE ESTADO E CIDADE

    if (filters.minPrice !== null && filters.minPrice !== '') {
      currentProducts = currentProducts.filter(product => (product.price || 0) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== null && filters.maxPrice !== '') {
      currentProducts = currentProducts.filter(product => (product.price || 0) <= parseFloat(filters.maxPrice));
    }
    if (filters.rating) {
        currentProducts = currentProducts.filter(p => (p.rating || 0) >= filters.rating);
    }

    return currentProducts.sort((a, b) => {
      if (!a || !b) return 0;
      switch (filters.sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name || '') || 0;
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [productsInCategory, filters]);

  const activeFiltersDisplay = useMemo(() => {
    const active = [];
    if (filters.searchTerm) active.push({ type: 'searchTerm', value: filters.searchTerm, label: `Busca: "${filters.searchTerm}"` });
    if (filters.state) active.push({ type: 'state', value: filters.state, label: `Estado: ${filters.state}` });
    if (filters.city) active.push({ type: 'city', value: filters.city, label: `Cidade: ${filters.city}` });
    if (filters.rating) active.push({ type: 'rating', value: filters.rating, label: `${filters.rating} Estrelas+` });
    if (filters.minPrice !== null && filters.minPrice !== '') active.push({ type: 'minPrice', value: filters.minPrice, label: `Preço Min: R$${filters.minPrice}` });
    if (filters.maxPrice !== null && filters.maxPrice !== '') active.push({ type: 'maxPrice', value: filters.maxPrice, label: `Preço Max: R$${filters.maxPrice}` });
    if (filters.announcerType && filters.announcerType !== 'all') active.push({ type: 'announcerType', value: filters.announcerType, label: `Anunciante: ${filters.announcerType === 'private' ? 'Particular' : 'Profissional'}` });
    return active;
  }, [filters]);


  // --- Renderização condicional para estados de carregamento e erro ---
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-20 bg-gray-200 animate-pulse w-full max-w-7xl mx-auto rounded-xl mt-4"></div>
        <div className="h-72 bg-gray-300 animate-pulse w-full max-w-6xl mx-auto rounded-2xl mt-4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-24 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">Categoria não encontrada.</p>
          </div>
        </div>
      </div>
    );
  }

  const bannerImage = category.banner_url || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão de Voltar e Nome/Descrição da Categoria */}
      <section className="bg-white border-b border-gray-100 py-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 text-gray-700 hover:text-orange-600 px-0"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{category.name}</h1>
            {category.featured && (
              <Badge className="bg-orange-500 text-white text-sm px-3 py-1">
                Destaque
              </Badge>
            )}
          </div>
          {category.description && (
            <p className="text-lg text-gray-600 max-w-3xl">{category.description}</p>
          )}
        </div>
      </section>

      {/* Hero Section (Apenas com o banner de fundo, sem stats, nome/descrição) */}
      {bannerImage && ( // Renderiza o banner apenas se houver imagem
        <section className="relative h-64 flex justify-center items-center px-4 mb-8">
          <div
            className="w-full max-w-6xl h-full rounded-2xl overflow-hidden bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
          </div>
        </section>
      )}

      {/* Main Content Area with Sidebar and Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-100px)] lg:overflow-y-auto pb-4 custom-scrollbar">
          <SidebarFilter onFilterChange={handleFilterChange} filters={filters} />
        </div>

        {/* Results Area */}
        <div className="flex-1">
          {/* Search and Sort Controls */}
          <section className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar nesta categoria..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="pl-10 h-10 rounded-full border-gray-300 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {/* CORREÇÃO APLICADA AQUI: Ensure Select and its children are well-formed */}
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-full border-gray-300">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mostRelevant">Mais Relevantes</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="rating">Melhor avaliado</SelectItem>
                    {filters.activeTab === 'products' && (
                      <>
                        <SelectItem value="price-low">Menor preço</SelectItem>
                        <SelectItem value="price-high">Maior preço</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                  <button
                    onClick={() => handleFilterChange('viewMode', 'grid')}
                    className={`p-2 rounded-full transition-colors ${
                      filters.viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-orange-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFilterChange('viewMode', 'list')}
                    className={`p-2 rounded-full transition-colors ${
                      filters.viewMode === 'list' 
                        ? 'bg-white shadow-sm text-orange-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Active Filters Display */}
          {activeFiltersDisplay.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }} 
              className="flex flex-wrap gap-2 mb-6"
            >
              {activeFiltersDisplay.map((filter) => (
                <Badge 
                  key={filter.type + (filter.value?.toString() || '')}
                  variant="secondary" 
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-1 hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleFilterChange(filter.type, null)}
                >
                  <span>{filter.label}</span>
                  <X className="h-3 w-3 ml-1 text-gray-500" />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                onClick={() => handleFilterChange('clearAll')} 
                className="text-gray-500 hover:text-orange-600 p-0 h-auto text-sm"
              >
                Limpar Todos
              </Button>
            </motion.div>
          )}

          <Tabs value={filters.activeTab} onValueChange={(value) => handleFilterChange('activeTab', value)}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-200 rounded-xl p-1 shadow-inner">
              <TabsTrigger 
                value="companies" 
                className={`rounded-lg py-2 transition-colors duration-200 ${
                  filters.activeTab === 'companies' ? 'bg-white shadow text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Empresas ({filteredCompanies.length})
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className={`rounded-lg py-2 transition-colors duration-200 ${
                  filters.activeTab === 'products' ? 'bg-white shadow text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Produtos ({filteredProducts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="space-y-6">
              {(companiesLoading || categoryLoading) ? (
                <div className={`grid gap-6 ${
                  filters.viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                  ))}
                </div>
              ) : filteredCompanies.length > 0 ? (
                <motion.div
                  className={`grid gap-6 ${
                    filters.viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1 max-w-4xl mx-auto'
                  }`}
                  layout
                >
                  <AnimatePresence>
                    {filteredCompanies.map((company, index) => (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <CompanyCard company={company} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-gray-100 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma empresa encontrada
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou os termos de busca.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              {(productsLoading || categoryLoading) ? (
                <div className={`grid gap-6 ${
                  filters.viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-xl" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  className={`grid gap-6 ${
                    filters.viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1 max-w-4xl mx-auto'
                  }`}
                  layout
                >
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-gray-100 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou os termos de busca.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}