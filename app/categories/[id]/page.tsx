'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import CompanyCard from '@/components/CompanyCard';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCategory } from '@/hooks/useCategory';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  
  const { category, loading: categoryLoading, error } = useCategory(categoryId);
  const { companies, loading: companiesLoading } = useCompanies();
  const { products, loading: productsLoading } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('companies');

  const relatedCompanies = category?.companies || [];
  const relatedProducts = category?.products || [];

  const filteredCompanies = relatedCompanies
    .filter(company => 
      company && company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company && company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!a || !b || !a.name || !b.name) return 0;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredProducts = relatedProducts
    .filter(product => 
      product && product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product && product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!a || !b) return 0;
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name || '') || 0;
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

  const stats = {
    companies: filteredCompanies.length,
    products: filteredProducts.length,
    avgRating: 4.6,
    projects: Math.floor(Math.random() * 1000) + 500,
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-64 bg-gray-300 animate-pulse"></div>
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
            <p className="text-red-600">Categoria não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  const bannerImage = category.banner_url || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-72 flex justify-center items-center px-4">
        <div 
          className="w-full max-w-6xl h-full rounded-2xl overflow-hidden bg-cover bg-center relative"
          style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : { backgroundImage: 'linear-gradient(to right, #f59e0b, #f97316)' }}
        >
          <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
          
          <div className="relative h-full flex items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white max-w-3xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
                {category.featured && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    Destaque
                  </Badge>
                )}
              </div>
              
              {category.description && (
                <p className="text-xl mb-6 text-white/90">{category.description}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.companies}</div>
                  <div className="text-sm text-white/80">Empresas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.products}</div>
                  <div className="text-sm text-white/80">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                  <div className="text-sm text-white/80">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.projects}+</div>
                  <div className="text-sm text-white/80">Projetos</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar nesta categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="rating">Melhor avaliado</SelectItem>
                  {activeTab === 'products' && (
                    <>
                      <SelectItem value="price-low">Menor preço</SelectItem>
                      <SelectItem value="price-high">Maior preço</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="companies">
              Empresas ({filteredCompanies.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Produtos ({filteredProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            {companiesLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
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
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}
                layout
              >
                {filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <CompanyCard company={company} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma empresa encontrada
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os termos de busca.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {productsLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
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
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}
                layout
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os termos de busca.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
