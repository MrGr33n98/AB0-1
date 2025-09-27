'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import { useCategories } from '@/hooks/useCategories';
import { reviewsApiSafe } from '@/lib/api-client';
import Script from 'next/script';

// Componentes da UI
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import CompanyCard from '@/components/CompanyCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Ícones e utilitários
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  user: { name: string };
  company: { name: string };
}

export default function Home() {
  const { companies, loading: companiesLoading, error: companiesError } = useCompaniesSafe({ featured: true, status: 'active' });
  const { categories, loading: categoriesLoading } = useCategories();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Debug companies
  console.log('Companies:', companies);
  console.log('Companies loading:', companiesLoading);

  // Buscar reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewsApiSafe.getAll({ limit: 6 });
        const formattedReviews = data.map((review) => ({
          id: review.id,
          title: review.comment.split('.')[0] || 'Avaliação',
          content: review.comment,
          rating: review.rating,
          user: { name: review.user?.name || 'Usuário anônimo' },
          company: { name: review.product?.name || 'Produto/Serviço' },
        }));
        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const featuredCompanies = useMemo(
    () => {
      const filtered = companies.slice(0, 6);
      console.log('Featured companies:', filtered);
      return filtered;
    },
    [companies]
  );

  const featuredCategories = useMemo(
    () =>
      categories
        .filter((category) => category.featured && category.status === 'active')
        .slice(0, 8),
    [categories]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Compare Solar',
    url: 'https://www.comparesolar.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.comparesolar.com.br/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background antialiased">
        {/* Hero Section */}
        <Hero />

        {/* Categorias em Destaque */}
        <section
          className="py-20 bg-background"
          id="categorias"
          aria-labelledby="categorias-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                id="categorias-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              >
                Explore Nossas Categorias
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Encontre o que você precisa, de painéis solares a consultoria
                especializada.
              </motion.p>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {featuredCategories.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="text-center mt-12">
              <Link href="/categories" passHref>
                <Button size="lg" variant="ghost">
                  Ver Todas as Categorias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Empresas em Destaque */}
        <section
          className="py-20 bg-card"
          id="empresas"
          aria-labelledby="empresas-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                id="empresas-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              >
                Empresas Parceiras
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Conheça as empresas mais bem avaliadas e verificadas pelos
                nossos usuários.
              </motion.p>
            </div>

            {companiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : companiesError ? (
              <div className="text-center text-red-500">
                <p>Ocorreu um erro ao carregar as empresas. Tente novamente mais tarde.</p>
                <p>{companiesError}</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {featuredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </motion.div>
            )}

            <div className="text-center mt-12">
              <Link href="/companies" passHref>
                <Button size="lg" className="bg-primary text-white">
                  Ver Todas as Empresas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
