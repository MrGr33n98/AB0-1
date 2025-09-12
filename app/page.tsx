'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanies } from '@/hooks/useCompanies';
import { useCategories } from '@/hooks/useCategories';
import { reviewsApi } from '@/lib/api';

// Componentes da UI
import Hero from '@/components/Hero';
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
  const { companies, loading: companiesLoading } = useCompanies();
  const { categories, loading: categoriesLoading } = useCategories();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // MOCK DE DADOS (usando useMemo para estabilidade)
  const benefits: Benefit[] = useMemo(() => [
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
  ], []);

  const faqs: FAQ[] = useMemo(() => [
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
  ], []);

  // Lógica de reviews (com fallback para mock se a API falhar)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Assume que reviewsApi.getAll() retorna um array de Review
        const data = await reviewsApi.getAll();
        setReviews(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Fallback para dados mockados em caso de erro
        setReviews([
          { id: 1, title: "Instalação impecável!", content: "Equipe super profissional e atenciosa.", rating: 5, user: { name: "John Doe" }, company: { name: "Solar Solutions" } },
          { id: 2, title: "Economia garantida", content: "Minha conta de luz caiu drasticamente.", rating: 5, user: { name: "Jane Smith" }, company: { name: "Green Energy Co." } },
          { id: 3, title: "Atendimento de primeira", content: "Tive algumas dúvidas e a equipe de suporte foi muito paciente e prestativa.", rating: 4, user: { name: "Peter Jones" }, company: { name: "Sun Power" } },
          { id: 4, title: "Solução completa", content: "Encontrei tudo que precisava, do painel à instalação. Recomendo!", rating: 5, user: { name: "Ana Pires" }, company: { name: "Solar Solutions" } },
          { id: 5, title: "Melhor custo-benefício", content: "O preço foi o melhor do mercado e a qualidade superou as expectativas.", rating: 4, user: { name: "Lucas Fernandes" }, company: { name: "Eco Energy" } },
          { id: 6, title: "Rápido e eficiente", content: "Processo de orçamento e contratação foi muito ágil.", rating: 5, user: { name: "Mariana Costa" }, company: { name: "Green Power" } },
        ]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const featuredCompanies = useMemo(() => companies.slice(0, 6), [companies]);
  const featuredCategories = useMemo(() => categories.filter(cat => cat.featured).slice(0, 4), [categories]);

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

  return (
    <div className="min-h-screen bg-background antialiased"> {/* Usando bg-background */}
      {/* Hero Section - Mantém a lógica do Hero component, focando na primeira impressão */}
      {/* Você precisará garantir que o Hero component também use as novas classes de cores */}
      <Hero />

      {/* Seção 1: Credibilidade e Proposta de Valor */}
      <section className="py-20 bg-card"> {/* Usando bg-card para seções em destaque */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
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
      <section className="py-20 bg-background"> {/* Usando bg-background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
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

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                >
                  {/* CategoryCard deve usar as novas cores internamente */}
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/categories" passHref>
              <Button size="lg" variant="ghost" className="text-accent hover:text-accent/90 font-bold text-lg">
                Ver Todas as Categorias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 3: Empresas em Destaque */}
      <section className="py-20 bg-card"> {/* Usando bg-card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            >
              {featuredCompanies.map((company) => (
                <motion.div
                  key={company.id}
                  variants={itemVariants}
                >
                  {/* CompanyCard deve usar as novas cores internamente */}
                  <CompanyCard company={company} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/companies" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
                Ver Todas as Empresas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Seção 4: Avaliações */}
      <section className="py-20 bg-background"> {/* Usando bg-background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
            >
              O que Nossos Clientes Dizem
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Reviews reais de quem já encontrou a solução perfeita com o Compare Solar.
            </motion.p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={itemVariants}
                >
                  {/* ReviewCard deve usar as novas cores internamente */}
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/reviews" passHref>
              <Button size="lg" variant="ghost" className="text-accent hover:text-accent/90 font-bold text-lg">
                Ver Todas as Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 5: FAQ */}
      <section className="py-20 bg-card"> {/* Usando bg-card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Respostas para as suas principais dúvidas sobre o Compare Solar.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="space-y-6"
          >
            {faqs.map((faq) => (
              <motion.div
                key={faq.question}
                variants={itemVariants}
                className="bg-background rounded-2xl p-8 shadow-md border border-border transform transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Seção 6: CTA Final */}
      <section className="py-20 bg-primary"> {/* Usando bg-primary */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
              Solicite orçamentos gratuitos das melhores empresas de energia solar do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all"
              >
                Solicitar Orçamento Grátis
              </Button>
              <Link href="/companies" passHref>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-10 py-4 rounded-full text-lg font-bold transition-all"
                >
                  Explorar Empresas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}