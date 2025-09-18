'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { searchApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Building, Package, FileText, Folder, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { debounce } from 'lodash';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onClose?: () => void;
  fullWidth?: boolean; // mantém compatibilidade, mas centralizamos com max-width
}

type GroupKey = 'companies' | 'products' | 'categories' | 'articles';

export default function SearchBar({
  placeholder = 'Buscar empresas, produtos, categorias...',
  className = '',
  onClose,
  fullWidth = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    companies: any[];
    products: any[];
    categories: any[];
    articles: any[];
  }>({
    companies: [],
    products: [],
    categories: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Navegação por teclado
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = 'search-suggestions-listbox';

  // evita race conditions
  const requestSeqRef = useRef(0);

  // Debounced suggest
  const debouncedSearch = useRef(
    debounce(async (searchTerm: string) => {
      const currentSeq = ++requestSeqRef.current;

      if (!searchTerm.trim()) {
        setResults({ companies: [], products: [], categories: [], articles: [] });
        setLoading(false);
        setActiveIndex(-1);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchApi.suggest(searchTerm);
        if (currentSeq === requestSeqRef.current) {
          setResults(data);
          const hasAny = Object.values(data).some((arr: any[]) => arr?.length > 0);
          setActiveIndex(hasAny ? 0 : -1);
        }
      } catch (err) {
        console.error('Search error:', err);
        if (currentSeq === requestSeqRef.current) setError('Erro ao buscar resultados');
      } finally {
        if (currentSeq === requestSeqRef.current) setLoading(false);
      }
    }, 300)
  ).current;

  // Submit -> página de busca “full”
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      pushToSearchPage();
    }
  };

  const pushToSearchPage = () => {
    router.push({
      pathname: '/search',
      query: { q: query, sort: 'rating', page: '1' } as any,
    });
    setShowResults(false);
    setActiveIndex(-1);
    onClose?.();
  };

  // Alterar input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setShowResults(true);
      setLoading(true);
      debouncedSearch(value);
    } else {
      setShowResults(false);
      setResults({ companies: [], products: [], categories: [], articles: [] });
      setActiveIndex(-1);
    }
  };

  // Clique no item
  const handleItemClick = (type: string, id: number) => {
    setShowResults(false);
    setActiveIndex(-1);
    router.push(`/${type}/${id}`);
    onClose?.();
  };

  // Limpar
  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    setResults({ companies: [], products: [], categories: [], articles: [] });
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const hasResults = useMemo(
    () => Object.values(results).some((arr) => (arr as any[])?.length > 0),
    [results]
  );

  // Flatten para navegação por teclado
  const flatItems = useMemo(() => {
    const order: GroupKey[] = ['companies', 'products', 'categories', 'articles'];
    const items: { type: GroupKey; id: number; label: string }[] = [];
    order.forEach((group) => {
      (results[group] || []).forEach((item: any) => {
        items.push({
          type: group,
          id: item.id,
          label: group === 'articles' ? item.title : item.name || item.title || String(item.id),
        });
      });
    });
    return items;
  }, [results]);

  // Teclado: ↑/↓/Enter/Esc
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || (!hasResults && !loading)) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= flatItems.length ? flatItems.length - 1 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? -1 : next;
      });
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        const target = flatItems[activeIndex];
        handleItemClick(target.type, target.id);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setActiveIndex(-1);
    }
  };

  // Reabre dropdown ao focar se já tem query
  const handleFocus = () => {
    if (query.trim() && (hasResults || loading)) setShowResults(true);
  };

  /* ---- Layout centralizado estilo Google ----
     - wrapper centralizado com mx-auto
     - largura controlada por max-w (ex.: 680px)
     - input ocupa 100% do wrapper
  */
  const wrapperMaxWidth = fullWidth ? 'max-w-[880px]' : 'max-w-[680px]';
  const inputWidthClass = 'w-full'; // ocupa todo o wrapper

  return (
    <div
      ref={searchRef}
      className={`
        relative mx-auto ${wrapperMaxWidth} w-full
        ${className}
      `}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <label htmlFor="global-search" className="sr-only">
            {placeholder}
          </label>

          <Input
            id="global-search"
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            aria-autocomplete="list"
            aria-controls={showResults ? listboxId : undefined}
            aria-expanded={showResults}
            aria-activedescendant={
              activeIndex >= 0 && flatItems[activeIndex]
                ? `option-${flatItems[activeIndex].type}-${flatItems[activeIndex].id}`
                : undefined
            }
            className={`
              ${inputWidthClass}
              pl-12 pr-12 h-12 md:h-12 rounded-full text-base
              bg-white/95 border border-gray-200 shadow-sm
              hover:bg-white focus:bg-white
              transition
              focus-visible:ring-2 focus-visible:ring-blue-500/40
              focus:shadow-md
            `}
          />

          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100"
              aria-label="Limpar busca"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown (alinhado exatamente sob o input, mesma largura do wrapper) */}
      {showResults && (
        <div
          className={`
            absolute left-0 right-0 z-[60] mt-2
            w-full
            bg-white rounded-2xl shadow-2xl border border-gray-100
            max-h-[70vh] overflow-auto
          `}
          role="listbox"
          id={listboxId}
        >
          {/* Loading */}
          {loading && (
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          )}

          {/* Erro */}
          {error && !loading && (
            <div className="p-4 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Nenhum resultado */}
          {!loading && !error && query && !hasResults && (
            <div className="p-6 text-center text-gray-500">
              Nenhum resultado encontrado para "<span className="font-medium">{query}</span>"
            </div>
          )}

          {/* Resultados */}
          {!loading && hasResults && (
            <div className="divide-y divide-gray-100">
              {/* Empresas */}
              {results.companies.length > 0 && (
                <Section title="Empresas" ariaLabel="Sugestões de empresas">
                  {results.companies.slice(0, 5).map((company) => {
                    const indexFlat = flatItems.findIndex(
                      (i) => i.type === 'companies' && i.id === company.id
                    );
                    const isActive = activeIndex === indexFlat;
                    return (
                      <Row
                        key={company.id}
                        id={`option-companies-${company.id}`}
                        icon={<Building size={16} className="text-gray-500" />}
                        title={
                          <>
                            {company.name}{' '}
                            {company.city && company.state && (
                              <span className="text-sm text-gray-500 ml-1">
                                ({company.city} - {company.state})
                              </span>
                            )}
                          </>
                        }
                        subtitle={company.description}
                        active={isActive}
                        onClick={() => handleItemClick('companies', company.id)}
                        onMouseEnter={() => setActiveIndex(indexFlat)}
                      />
                    );
                  })}
                </Section>
              )}

              {/* Produtos */}
              {results.products.length > 0 && (
                <Section title="Produtos" ariaLabel="Sugestões de produtos">
                  {results.products.slice(0, 5).map((product) => {
                    const indexFlat = flatItems.findIndex(
                      (i) => i.type === 'products' && i.id === product.id
                    );
                    const isActive = activeIndex === indexFlat;
                    return (
                      <Row
                        key={product.id}
                        id={`option-products-${product.id}`}
                        icon={<Package size={16} className="text-gray-500" />}
                        title={product.name}
                        subtitle={product.description}
                        active={isActive}
                        onClick={() => handleItemClick('products', product.id)}
                        onMouseEnter={() => setActiveIndex(indexFlat)}
                      />
                    );
                  })}
                  {results.products.length > 5 && (
                    <SeeMore
                      onClick={pushToSearchPage}
                      label={`Ver mais ${results.products.length - 5} produtos`}
                    />
                  )}
                </Section>
              )}

              {/* Categorias */}
              {results.categories.length > 0 && (
                <Section title="Categorias" ariaLabel="Sugestões de categorias">
                  {results.categories.slice(0, 5).map((category) => {
                    const indexFlat = flatItems.findIndex(
                      (i) => i.type === 'categories' && i.id === category.id
                    );
                    const isActive = activeIndex === indexFlat;
                    return (
                      <Row
                        key={category.id}
                        id={`option-categories-${category.id}`}
                        icon={<Folder size={16} className="text-gray-500" />}
                        title={category.name}
                        subtitle={category.short_description}
                        active={isActive}
                        onClick={() => handleItemClick('categories', category.id)}
                        onMouseEnter={() => setActiveIndex(indexFlat)}
                      />
                    );
                  })}
                  {results.categories.length > 5 && (
                    <SeeMore
                      onClick={pushToSearchPage}
                      label={`Ver mais ${results.categories.length - 5} categorias`}
                    />
                  )}
                </Section>
              )}

              {/* Artigos */}
              {results.articles.length > 0 && (
                <Section title="Artigos" ariaLabel="Sugestões de artigos">
                  {results.articles.slice(0, 5).map((article) => {
                    const indexFlat = flatItems.findIndex(
                      (i) => i.type === 'articles' && i.id === article.id
                    );
                    const isActive = activeIndex === indexFlat;
                    return (
                      <Row
                        key={article.id}
                        id={`option-articles-${article.id}`}
                        icon={<FileText size={16} className="text-gray-500" />}
                        title={article.title}
                        subtitle={
                          article.content ? String(article.content).substring(0, 80) + '…' : undefined
                        }
                        active={isActive}
                        onClick={() => handleItemClick('articles', article.id)}
                        onMouseEnter={() => setActiveIndex(indexFlat)}
                      />
                    );
                  })}
                  {results.articles.length > 5 && (
                    <SeeMore
                      onClick={pushToSearchPage}
                      label={`Ver mais ${results.articles.length - 5} artigos`}
                    />
                  )}
                </Section>
              )}

              {/* Ver todos */}
              <div className="p-2">
                <Button variant="outline" className="w-full" onClick={pushToSearchPage}>
                  Ver todos os resultados
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- UI internos ---------- */

function Section({
  title,
  ariaLabel,
  children,
}: {
  title: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-2">
      <div
        className="
          sticky top-0 z-10
          px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider
          bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70
          rounded-t-md
        "
        aria-label={ariaLabel}
      >
        {title}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Row({
  id,
  icon,
  title,
  subtitle,
  active,
  onClick,
  onMouseEnter,
}: {
  id: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={!!active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        px-3 py-2 rounded-lg cursor-pointer flex items-start gap-2
        ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}
        transition-colors
      `}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="font-medium leading-5 truncate">{title}</div>
        {subtitle && <div className="text-sm text-gray-500 truncate">{subtitle}</div>}
      </div>
    </div>
  );
}

function SeeMore({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:underline flex items-center gap-1"
    >
      {label}
      <ChevronRight size={14} />
    </button>
  );
}
