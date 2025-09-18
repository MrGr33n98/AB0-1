'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesSafe } from '@/hooks/useCompaniesSafe';
import { useCategories } from '@/hooks/useCategories';
import { reviewsApiSafe } from '@/lib/api-client';
import Head from 'next/head';
import Script from 'next/script';
import { useAuth } from '@/contexts/AuthContext';

// Componentes da UI
import CategoryCard from '@/components/CategoryCard';
import CompanyCard from '@/components/CompanyCard';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Ícones e utilitários
import { ArrowRight, Star, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';

// Tipagem para dados mockados
interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  user: { name: string };
  company: { name: string };
}

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Home() {
  const { companies, loading: companiesLoading } = useCompaniesSafe();
  const { categories, loading: categoriesLoading } = useCategories();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Benefícios da plataforma
  const benefits: Benefit[] = [
    {
      icon: Shield,
      title: 'Empresas Verificadas',
      description: 'Todas as empresas parceiras são rigorosamente verificadas para sua segurança.',
    },
    {
      icon: Star,
      title: 'Avaliações Reais',
      description: 'Decisões inteligentes com reviews autênticos de clientes como você.',
    },
    {
      icon: Zap,
      title: 'Orçamentos Gratuitos',
      description: 'Compare propostas e encontre a melhor opção sem custo algum.',
    },
    {
      icon: Users,
      title: 'Suporte Especializado',
      description: 'Nossa equipe está pronta para te guiar em cada etapa do processo.',
    },
  ];

  // Perguntas frequentes
  const faqs: FAQ[] = [
    {
      question: 'Como funciona o Compare Solar?',
      answer: 'Nosso marketplace conecta você com as melhores empresas de energia solar. Você pode comparar preços, avaliar reviews e solicitar orçamentos gratuitos.',
    },
    {
      question: 'É realmente gratuito?',
      answer: 'Sim! O uso da plataforma é 100% gratuito para consumidores. Você não paga nada para comparar empresas e solicitar orçamentos.',
    },
    {
      question: 'Como vocês verificam as empresas?',
      answer: 'Verificamos documentação, licenças, certificações e histórico de cada empresa antes de aprová-las na plataforma.',
    },
    {
      question: 'Posso cancelar um orçamento?',
      answer: 'Sim, você pode cancelar ou modificar solicitações de orçamento a qualquer momento através do seu painel.',
    },
  ];

  // Lógica de reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewsApiSafe.getAll({ limit: 6 });
        // The backend now returns user and product names, so we can simplify this.
        const formattedReviews = data.map(review => ({
          id: review.id,
          title: review.comment.split('.')[0] || 'Avaliação',
          content: review.comment,
          rating: review.rating,
          user: { name: review.user?.name || 'Usuário anônimo' },
          company: { name: review.product?.name || 'Produto/Serviço' } // Assuming product name is the company name here
        }));
        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]); // Set to empty array on error
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Usando as empresas já filtradas pelo hook useCompaniesSafe
  const featuredCompanies = useMemo(() => 
    companies.filter(company => company.featured).slice(0, 6),
    [companies]
  );
  const featuredCategories = useMemo(() => 
    categories.filter(category => category.featured && category.status === 'active').slice(0, 8),
    [categories]
  );

  // Framer Motion Variants para animações em cascata
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Add structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Compare Solar",
    "url": "https://www.comparesolar.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.comparesolar.com.br/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-background antialiased">
        {/* Seção 1: Credibilidade e Proposta de Valor */}
        <section className="py-20 bg-card" id="beneficios" aria-labelledby="beneficios-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                id="beneficios-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              >
                Acreditamos em uma Energia Inteligente
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Conectamos você às melhores soluções de energia solar do Brasil, com total transparência e confiança.
              </motion.p>
            </div>

            {/* Benefits section remains the same */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className="text-center p-8 bg-background rounded-2xl shadow-lg border border-border transform transition-transform hover:scale-105 duration-300"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-accent rounded-2xl shadow-xl">
                      <benefit.icon className="h-10 w-10 text-accent-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Seção 2: Categorias em Destaque */}
        <section className="py-20 bg-background" id="categorias" aria-labelledby="categorias-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                id="categorias-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              >
                Explore Nossas Categorias
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Encontre o que você precisa, de painéis solares a consultoria especializada.
              </motion.p>
            </div>

            {/* Categories section with improved accessibility */}
            {categoriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Carregando categorias">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                role="list"
                aria-label="Lista de categorias em destaque"
              >
                {featuredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    role="listitem"
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="text-center mt-12">
              <Link href="/categories" passHref aria-label="Ver todas as categorias disponíveis">
                <Button size="lg" variant="ghost" className="text-accent hover:text-accent/90 font-bold text-lg">
                  Ver Todas as Categorias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Rest of the sections with similar improvements */}
        {/* ... */}
        
        {/* Seção 3: Empresas em Destaque */}
        <section className="py-20 bg-card" id="empresas" aria-labelledby="empresas-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                id="empresas-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              >
                Empresas Parceiras
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Conheça as empresas mais bem avaliadas e verificadas pelos nossos usuários.
              </motion.p>
            </div>

            {companiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true" aria-label="Carregando empresas">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                role="list"
                aria-label="Lista de empresas em destaque"
              >
                {featuredCompanies.map((company) => (
                  <div key={company.id} className="w-full">
                    <CompanyCard company={company} />
                  </div>
                ))}
              </motion.div>
            )}

            <div className="text-center mt-12">
              <Link href="/companies" passHref aria-label="Ver todas as empresas disponíveis">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
                  Ver Todas as Empresas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Continue with the rest of the sections with similar improvements */}
        {/* ... */}
      </div>
    </>
  );
}