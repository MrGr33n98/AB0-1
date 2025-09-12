// app/categories/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanies } from '@/hooks/useCompanies';
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

// Dados mockados de todas as capitais e suas 5 maiores cidades
const mockStatesAndCities = {
  'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
  'AL': ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares'],
  'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
  'AP': ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
  'DF': ['Brasília', 'Ceilândia', 'Taguatinga', 'Gama', 'Samambaia'],
  'ES': ['Vitória', 'Serra', 'Vila Velha', 'Cariacica', 'Linhares'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'],
  'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'],
  'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'],
  'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba'],
  'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Cacoal', 'Vilhena'],
  'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Mucajaí', 'Pacaraima'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó'],
  'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'],
  'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André'],
  'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'],
};

export default function CompaniesPage() {
  const { companies, loading } = useCompanies();
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: null,
    state: null,
    city: null,
    rating: null,
  });

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

      // Filtrar por estado e cidade
      const companyAddressLower = company.address?.toLowerCase() || '';
      if (filters.state) {
        if (!companyAddressLower.includes(filters.state.toLowerCase())) {
          return false;
        }
      }
      if (filters.city) {
        if (!companyAddressLower.includes(filters.city.toLowerCase())) {
          return false;
        }
      }
      
      // Filtrar por avaliação (lógica mockada)
      if (filters.rating) {
        const mockRating = 4.5 + Math.random() * 0.5;
        if (mockRating < filters.rating) {
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