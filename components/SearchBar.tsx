'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Buscar empresas, produtos...",
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, search } = useSearch();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(() => {
        search(query);
        setIsOpen(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setIsOpen(false);
    }
  }, [query, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (type: string, id: number) => {
    const routes = {
      company: `/companies/${id}`,
      product: `/products/${id}`,
      article: `/articles/${id}`,
    };
    router.push(routes[type as keyof typeof routes] || '/');
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  const totalResults = results.companies.length + results.products.length + results.articles.length;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          {/* Lupa maior e alinhada */}
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          
          {/* Input ajustado */}
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-14 pr-12 h-16 text-lg w-full max-w-3xl mx-auto rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 shadow-sm"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-3xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Buscando...
              </div>
            ) : totalResults > 0 ? (
              <div className="py-2">
                {/* Companies */}
                {results.companies.length > 0 && (
                  <div className="px-4 py-2">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Empresas ({results.companies.length})</h4>
                    {results.companies.slice(0, 3).map((company) => (
                      <div
                        key={company.id}
                        onClick={() => handleResultClick('company', company.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500 truncate">{company.description}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products */}
                {results.products.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Produtos ({results.products.length})</h4>
                    {results.products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleResultClick('product', product.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Articles */}
                {results.articles.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Artigos ({results.articles.length})</h4>
                    {results.articles.slice(0, 3).map((article) => (
                      <div
                        key={article.id}
                        onClick={() => handleResultClick('article', article.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500 truncate">{article.content}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* View All Results */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium"
                  >
                    Ver todos os {totalResults} resultados
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum resultado encontrado para "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
