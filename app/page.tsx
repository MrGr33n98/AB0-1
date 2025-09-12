'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCompanies } from '@/hooks/useCompanies';
import { useCategories } from '@/hooks/useCategories'; // This line might be the issue
import CategoryCard from '@/components/CategoryCard';
import CompanyCard from '@/components/CompanyCard';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

import Hero from '@/components/Hero';
import { reviewsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Zap, Shield, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { companies, loading: companiesLoading } = useCompanies();
  const { categories, loading: categoriesLoading } = useCategories();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // In your Home component, replace the reviews fetching with mock data temporarily
  useEffect(() => {
  // Comment out the API call for now
  // const fetchReviews = async () => {
  //   try {
  //     const data = await reviewsApi.getAll();
  //     setReviews(data.slice(0, 6)); // Show only first 6 reviews
  //   } catch (error) {
  //     console.error('Error fetching reviews:', error);
  //   } finally {
  //     setReviewsLoading(false);
  //   }
  // };
  
  // fetchReviews();
  
  // Use mock data instead
  setReviews([
    {
      id: 1,
      title: "Great service",
      content: "The installation was quick and professional.",
      rating: 5,
      user: { name: "John Doe" },
      company: { name: "Solar Solutions" }
    },
    // Add more mock reviews as needed
  ]);
  setReviewsLoading(false);
}, []);

  const featuredCompanies = companies.slice(0, 6);
  const featuredCategories = categories.filter(cat => cat.featured).slice(0, 4);

  const benefits = [
    {
      icon: Shield,
      title: 'Empresas Verificadas',
      description: 'Todas as empresas são verificadas e possuem certificações válidas.',
    },
    {
      icon: Star,
      title: 'Avaliações Reais',
      description: 'Reviews de clientes reais para ajudar na sua decisão.',
    },
    {
      icon: Zap,
      title: 'Orçamentos Gratuitos',
      description: 'Compare orçamentos de múltiplas empresas gratuitamente.',
    },
    {
      icon: Users,
      title: 'Suporte Especializado',
      description: 'Nossa equipe te ajuda a encontrar a melhor solução.',
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Categorias em Destaque
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Explore nossas principais categorias de produtos e serviços de energia solar
            </motion.p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                Ver Todas as Categorias
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Empresas Recomendadas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Conheça as empresas mais bem avaliadas pelos nossos usuários
            </motion.p>
          </div>

          {companiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CompanyCard company={company} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/companies">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                Ver Todas as Empresas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Por que Escolher o Compare Solar?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Conectamos você com as melhores empresas de energia solar do Brasil
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              O que Nossos Clientes Dizem
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Reviews reais de clientes que encontraram a solução perfeita através do Compare Solar
            </motion.p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Tire suas dúvidas sobre o Compare Solar
            </motion.p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para Começar a Economizar?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Solicite orçamentos gratuitos das melhores empresas de energia solar do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold"
              >
                Solicitar Orçamento Grátis
              </Button>
              <Link href="/companies">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-xl text-lg font-semibold"
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