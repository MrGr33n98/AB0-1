'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, Filter } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
        default:
          return 0;
      }
    });

  const featuredCategories = filteredCategories.filter(cat => cat.featured);
  const regularCategories = filteredCategories.filter(cat => !cat.featured);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">Erro ao carregar categorias: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Categorias de Energia Solar
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Explore nossas categorias organizadas para encontrar exatamente o que você precisa
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base bg-white text-gray-900"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="featured">Destaques primeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count and view mode */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'categoria' : 'categorias'}
              </span>
              
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

      {/* Categories Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {/* Featured Categories */}
              {featuredCategories.length > 0 && (
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Categorias em Destaque</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-transparent"></div>
                  </div>
                  
                  <motion.div
                    className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                        : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}
                    layout
                  >
                    {featuredCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <CategoryCard category={category} />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}

              {/* Regular Categories */}
              {regularCategories.length > 0 && (
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Todas as Categorias</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>
                  
                  <motion.div
                    className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                        : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}
                    layout
                  >
                    {regularCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <CategoryCard category={category} />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termos de busca para encontrar categorias.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortBy('name');
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}