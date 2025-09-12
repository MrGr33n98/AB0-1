'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCompanies } from '@/hooks/useCompanies';
import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/CategoryCard';
import CompanyCard from '@/components/CompanyCard';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap, Shield, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import { reviewsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { companies, loading: companiesLoading } = useCompanies();
  const { categories, loading: categoriesLoading } = useCategories();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Mock data for demo
  useEffect(() => {
    setReviews([
      {
        id: 1,
        title: "Instalação impecável!",
        content: "Equipe super profissional e atenciosa. O processo de instalação foi rápido e sem problemas. Recomendo a todos que buscam qualidade e eficiência.",
        rating: 5,
        user: { name: "John Doe" },
        company: { name: "Solar Solutions" }
      },
      {
        id: 2,
        title: "Economia garantida",
        content: "Minha conta de luz caiu drasticamente. O investimento valeu a pena e o suporte da empresa foi excelente durante todo o processo.",
        rating: 5,
        user: { name: "Jane Smith" },
        company: { name: "Green Energy Co." }
      },
      {
        id: 3,
        title: "Atendimento de primeira",
        content: "Tive algumas dúvidas e a equipe de suporte foi muito paciente e prestativa. O sistema está funcionando perfeitamente.",
        rating: 4,
        user: { name: "Peter Jones" },
        company: { name: "Sun Power" }
      },
      // Adicione mais reviews para preencher o grid
    ]);
    setReviewsLoading(false);
  }, []);

  const featuredCompanies = companies.slice(0, 6);
  const featuredCategories = categories.filter(cat => cat.featured).slice(0, 4);

  const benefits = [
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

  const faqs = [
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Hero Section - Mantém a lógica do Hero component, focando na primeira impressão */}
      <Hero />

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Categorias em Destaque
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Explore nossas principais categorias de produtos e serviços de energia solar.
            </motion.p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
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
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button size="lg" variant="ghost" className="text-orange-600 hover:text-orange-700 font-bold text-lg">
                Ver Todas as Categorias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Por que nos Escolher?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Conectamos você com as melhores empresas de energia solar do Brasil, com total confiança.
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
                className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl shadow-xl">
                    <benefit.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Empresas Recomendadas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Conheça as empresas mais bem avaliadas e verificadas pelos nossos usuários.
            </motion.p>
          </div>

          {companiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
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
                  <CompanyCard company={company} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/companies">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg">
                Ver Todas as Empresas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              O que Nossos Clientes Dizem
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Reviews reais de quem já encontrou a solução perfeita com o Compare Solar.
            </motion.p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
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
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/reviews">
              <Button size="lg" variant="ghost" className="text-orange-600 hover:text-orange-700 font-bold text-lg">
                Ver Todas as Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
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
                className="bg-gray-50 rounded-2xl p-8 shadow-md border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              Solicite orçamentos gratuitos das melhores empresas de energia solar do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all"
              >
                Solicitar Orçamento Grátis
              </Button>
              <Link href="/companies">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-4 rounded-full text-lg font-bold transition-all"
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