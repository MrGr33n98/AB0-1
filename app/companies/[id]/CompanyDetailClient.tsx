'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Shield, 
  Award, 
  Users, 
  Calendar,
  ExternalLink,
  MessageCircle,
  ChevronsRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company, productsApi, reviewsApi, Product, Review } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ReviewCard from '@/components/ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyDetailClientProps {
  company: Company;
}

export default function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const router = useRouter();

  // Estatísticas da empresa
  const companyStats = {
    rating: reviews.reduce((acc, rev) => acc + rev.rating, 0) / (reviews.length || 1),
    reviewCount: reviews.length,
    completedProjects: products.length * 10, 
    yearsInBusiness: new Date().getFullYear() - new Date(company.created_at).getFullYear(),
    services: [
      'Instalação Residencial',
      'Instalação Comercial',
      'Instalação Industrial',
      'Manutenção e Suporte',
      'Consultoria Energética',
    ],
    certifications: ['ANEEL', 'CREA', 'ISO 9001'], // exemplo estático, pode vir da API
    stats: [
      { label: 'Produtos', value: `${products.length}+`, icon: Award },
      { label: 'Avaliações', value: `${reviews.length}`, icon: Users },
      { label: 'Anos no Mercado', value: `${new Date().getFullYear() - new Date(company.created_at).getFullYear()}+`, icon: Calendar },
      { label: 'Avaliação Média', value: `${(reviews.reduce((acc, rev) => acc + rev.rating, 0) / (reviews.length || 1)).toFixed(1)}/5`, icon: Star },
    ]
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const allProducts = await productsApi.getAll();
        const companyProducts = allProducts.filter(p => p.company_id === company.id);
        setProducts(companyProducts);
        
        const allReviews = await reviewsApi.getAll();
        const companyReviews = allReviews.filter(r => 
          companyProducts.some(p => p.id === r.product_id)
        );
        setReviews(companyReviews);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setProductsLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchCompanyData();
  }, [company.id]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <section className="relative bg-card py-12 shadow-sm rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botão de Voltar */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="group text-muted-foreground hover:text-foreground border-border hover:bg-muted transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Voltar
            </Button>
          </div>

          {/* Banner */}
          <div className="relative w-full mb-8">
            {company.banner_url ? (
              <img 
                src={company.banner_url} 
                alt={`${company.name} banner`}
                className="w-full h-[350px] object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-[350px] bg-muted rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-muted-foreground text-lg">Sem imagem de banner disponível</span>
              </div>
            )}
          </div>

          {/* Info da empresa */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-24 z-10 relative">
            <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex items-center">
              {company.logo_url && (
                <div className="mr-6">
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-sm"
                  />
                </div>
              )}
              
              <div>
                <h1 className="text-4xl font-extrabold text-foreground mb-2">{company.name}</h1>
                <p className="text-lg text-muted-foreground">{company.description}</p>
                
                <div className="flex items-center mt-4 space-x-6">
                  {/* Rating */}
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(companyStats.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-foreground">{companyStats.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">({companyStats.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors shadow-md text-primary-foreground">
                <MessageCircle className="mr-2 h-5 w-5" />
                Solicitar Orçamento
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted transition-colors text-foreground">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                {company.phone}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5 bg-card p-2 rounded-xl shadow-sm border border-border">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              </TabsList>
            
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  {/* Overview */}
                  <TabsContent value="overview" className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sobre a Empresa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed mb-6">{company.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold mb-3">Serviços Oferecidos</h4>
                            <ul className="space-y-2">
                              {companyStats.services.map((service) => (
                                <li key={service} className="flex items-center text-muted-foreground">
                                  <ChevronsRight className="w-4 h-4 text-primary mr-2" />
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Certificações</h4>
                            <div className="flex flex-wrap gap-3">
                              {companyStats.certifications.map((cert) => (
                                <Badge key={cert} variant="outline">
                                  <Shield className="w-4 h-4 mr-2 text-primary" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Products */}
                  <TabsContent value="products">
                    <Card>
                      <CardHeader>
                        <CardTitle>Produtos da Empresa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {productsLoading ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-80 rounded-2xl bg-muted" />
                            ))}
                          </div>
                        ) : products.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews */}
                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>Avaliações dos Clientes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {reviewsLoading ? (
                          <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                              <Skeleton key={i} className="h-48 rounded-2xl bg-muted" />
                            ))}
                          </div>
                        ) : reviews.length > 0 ? (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <ReviewCard key={review.id} review={review} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Nenhuma avaliação ainda.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Stats */}
                  <TabsContent value="stats">
                    <Card>
                      <CardHeader>
                        <CardTitle>Estatísticas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {companyStats.stats.map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              className="flex flex-col items-center text-center p-4 bg-muted rounded-xl"
                            >
                              <stat.icon className="h-6 w-6 mb-2 text-primary" />
                              <div className="text-2xl font-bold">{stat.value}</div>
                              <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="flex items-center space-x-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{company.phone}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5 text-primary" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website}
                        </a>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <span>{company.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
