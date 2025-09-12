'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, MapPin, Star, Grid, List } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import { useCompanies } from '@/hooks/useCompanies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompaniesPage() {
  const { companies, loading, error } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort companies
  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = (company.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (company.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || 
                            (company.address?.toLowerCase() || '').includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'location':
          return (a.address || '').localeCompare(b.address || '');
        default:
          return 0;
      }
    });

  // Extract unique locations for filter
  const locations = Array.from(new Set(
    companies.map(c => c.address?.split(',')[0]).filter(Boolean)
  ));

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">Erro ao carregar empresas: {error}</p>
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
              Encontre a Melhor Empresa Solar
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Compare empresas verificadas, veja avaliações reais e solicite orçamentos gratuitos
            </p>
            <div className="max-w-2xl mx-auto">
              <Input
                type="search"
                placeholder="Buscar empresas por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-base bg-white text-gray-900"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as localizações</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="location">Localização</SelectItem>
                  <SelectItem value="rating">Melhor avaliada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count and view mode */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredCompanies.length} {filteredCompanies.length === 1 ? 'empresa' : 'empresas'}
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

      {/* Companies Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[...Array(9)].map((_, i) => (
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
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termos de busca para encontrar empresas.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('all');
                  setSortBy('name');
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}