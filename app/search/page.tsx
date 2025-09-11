'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import CompanyCard from '@/components/CompanyCard';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const { results, loading, search, getTotalResults } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query);
    }
  };

  const totalResults = getTotalResults();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {initialQuery ? `Resultados para "${initialQuery}"` : 'Buscar'}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar empresas, produtos, artigos..."
                  className="pl-10 h-12 text-base"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Buscar
                </Button>
              </div>
            </form>

            {/* Results Summary */}
            {totalResults > 0 && (
              <p className="text-gray-600 mt-4">
                {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            </div>
          ) : totalResults > 0 ? (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="companies">
                  Empresas ({results.companies.length})
                </TabsTrigger>
                <TabsTrigger value="products">
                  Produtos ({results.products.length})
                </TabsTrigger>
                <TabsTrigger value="articles">
                  Artigos ({results.articles.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                {/* Companies */}
                {results.companies.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Empresas ({results.companies.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.companies.slice(0, 6).map((company, index) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <CompanyCard company={company} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {results.products.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Produtos ({results.products.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.products.slice(0, 6).map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {results.articles.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Artigos ({results.articles.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.articles.slice(0, 4).map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-white rounded-xl p-6 shadow-md"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-3">
                            {article.content}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="companies">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.companies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CompanyCard company={company} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="articles">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {article.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : query ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Não encontramos nenhum resultado para "{query}". Tente buscar por outros termos.
              </p>
              <Button
                onClick={() => setQuery('')}
                variant="outline"
              >
                Limpar Busca
              </Button>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Faça uma busca
              </h2>
              <p className="text-gray-600">
                Digite um termo de busca para encontrar empresas, produtos e artigos.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}