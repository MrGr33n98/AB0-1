// components/SidebarFilter.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, Star } from 'lucide-react';

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

// Componente genérico para renderizar uma seção de filtro expansível
const FilterSection = ({ title, children, isOpen, onToggle, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={className}>
    <button
      className="flex justify-between items-center w-full text-gray-700 font-semibold text-sm py-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
      onClick={onToggle}
    >
      {title}
      <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-2 space-y-1 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Componente do botão de filtro
const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
      active
        ? 'bg-orange-100 text-orange-600 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// Componente do botão de filtro de avaliação
const RatingFilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center space-x-2 text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
      active
        ? 'bg-orange-100 text-orange-600 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);


// Componente principal da barra lateral de filtros
const SidebarFilter = ({ onFilterChange, filters }) => {
  const { categories } = useCategories();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const handleFilterClick = (filterType, value) => {
    if (filters[filterType] === value) {
      onFilterChange(filterType, null);
    } else {
      onFilterChange(filterType, value);
    }
  };

  const ratings = [
    { value: 5, label: '5 Estrelas' },
    { value: 4, label: '4 Estrelas ou mais' },
    { value: 3, label: '3 Estrelas ou mais' }
  ];

  const availableCities = filters.state ? mockStatesAndCities[filters.state] : null;

  return (
    <div className="hidden lg:block w-72 bg-white rounded-2xl p-4 shadow-md border border-gray-100 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900">Filtros</h3>
        <Button 
          variant="ghost" 
          onClick={() => onFilterChange('clearAll')} 
          className="text-gray-500 hover:text-orange-600 p-0 h-auto text-sm"
        >
          Limpar
        </Button>
      </div>
      
      {/* Search Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h4 className="font-semibold text-xs text-gray-700 mb-1">BUSCA</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Buscar empresas..."
            className="pl-9 pr-3 py-1 rounded-full border-gray-300 focus:border-orange-500 transition-colors duration-200 h-8"
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            value={filters.searchTerm}
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <FilterSection title="CATEGORIAS" isOpen={openSection === 'categories'} onToggle={() => toggleSection('categories')}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterClick('category', cat.name)}
            className={`w-full text-left text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
              filters.category === cat.name
                ? 'bg-orange-100 text-orange-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </FilterSection>

      {/* State Filter */}
      <FilterSection title="ESTADO" isOpen={openSection === 'states'} onToggle={() => toggleSection('states')}>
        {Object.keys(mockStatesAndCities).map((state) => (
          <button
            key={state}
            onClick={() => handleFilterClick('state', state)}
            className={`w-full text-left text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
              filters.state === state
                ? 'bg-orange-100 text-orange-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {state}
          </button>
        ))}
      </FilterSection>
      
      {/* City Filter */}
      {filters.state && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="space-y-1 overflow-hidden mt-4"
        >
          <h4 className="font-semibold text-xs text-gray-700 mb-1">CIDADE ({filters.state})</h4>
          {mockStatesAndCities[filters.state].map((city) => (
            <button
              key={city}
              onClick={() => handleFilterClick('city', city)}
              className={`w-full text-left text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
                filters.city === city
                  ? 'bg-orange-100 text-orange-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {city}
            </button>
          ))}
        </motion.div>
      )}

      {/* Rating Filter */}
      <FilterSection title="AVALIAÇÃO" isOpen={openSection === 'ratings'} onToggle={() => toggleSection('ratings')}>
        {ratings.map((rating) => (
          <button
            key={rating.value}
            onClick={() => handleFilterClick('rating', rating.value)}
            className={`w-full text-left flex items-center space-x-2 text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
              filters.rating === rating.value
                ? 'bg-orange-100 text-orange-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Star className={`h-4 w-4 mr-1 ${filters.rating === rating.value ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
            <span className="text-sm">{rating.label}</span>
          </button>
        ))}
      </FilterSection>
    </div>
  );
};

export default SidebarFilter;