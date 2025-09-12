'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { // Adicionado 'ArrowLeft' para o ícone de voltar
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Shield, 
  Award, 
  Users, 
  Calendar,
  ExternalLink,
  MessageCircle,
  ChevronsRight,
  ArrowLeft // Ícone de voltar
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
  const router = useRouter(); // Inicializa o router

  // Mock data for demo
  const mockData = {
    rating: 4.8,
    reviewCount: 127,
    completedProjects: 450,
    yearsInBusiness: 8,
    certifications: ['INMETRO', 'ABNT', 'ISO 9001'],
    badges: ['Top Rated 2025', 'Verified Company', 'Industry Leader'],
    gallery: [
      'https://images.pexels.com/photos/9875456/pexels-photo-9875456.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/9875357/pexels-photo-9875357.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/9875425/pexels-photo-9875425.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    ],
    services: [
      'Instalação Residencial',
      'Instalação Comercial',
      'Instalação Industrial',
      'Manutenção e Suporte',
      'Consultoria Energética',
      'Financiamento Solar'
    ],
    stats: [
      { label: 'Projetos Concluídos', value: '450+', icon: Award },
      { label: 'Clientes Satisfeitos', value: '400+', icon: Users },
      { label: 'Anos de Experiência', value: '8+', icon: Calendar },
      { label: 'Avaliação Média', value: '4.8/5', icon: Star },
    ]
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Fetch products by company
        const allProducts = await productsApi.getAll();
        const companyProducts = allProducts.filter(p => p.company_id === company.id);
        setProducts(companyProducts);
        
        // Fetch reviews for company products
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
      {/* Hero Section */}
      <section className="relative bg-card py-12 shadow-sm rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botão de Voltar */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="group text-muted-foreground hover:text-foreground border-border hover:bg-muted transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> {/* Ícone de seta para a esquerda */}
              Voltar
            </Button>
          </div>

          {/* Banner Image */}
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

          {/* Company Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-24 z-10 relative">
            <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex items-center">
              {/* Company Logo */}
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
                  <div className="flex flex-wrap gap-2">
                    {mockData.badges.map((badge) => (
                      <Badge 
                        key={badge} 
                        variant="default"
                        className="bg-accent/10 text-accent-foreground font-semibold border-accent/20"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(mockData.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-foreground">{mockData.rating}</span>
                    <span className="text-muted-foreground ml-1">({mockData.reviewCount} reviews)</span>
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

          {/* Tabs moved up here */}
          <div className="mt-12">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5 bg-card p-2 rounded-xl shadow-sm border border-border">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:rounded-lg"
                >
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="products"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:rounded-lg"
                >
                  Produtos
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:rounded-lg"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:rounded-lg"
                >
                  Galeria
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:rounded-lg"
                >
                  Estatísticas
                </TabsTrigger>
              </TabsList>
            
              {/* Main Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <TabsContent value="overview" className="space-y-8">
                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground">Sobre a Empresa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                          {company.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-xl text-foreground mb-3">Serviços Oferecidos</h4>
                            <ul className="space-y-3">
                              {mockData.services.map((service) => (
                                <li key={service} className="flex items-center text-muted-foreground">
                                  <ChevronsRight className="w-4 h-4 text-primary mr-2" />
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-xl text-foreground mb-3">Certificações</h4>
                            <div className="flex flex-wrap gap-3">
                              {mockData.certifications.map((cert) => (
                                <Badge 
                                  key={cert} 
                                  variant="outline" 
                                  className="text-sm border-2 border-border text-foreground"
                                >
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

                  <TabsContent value="products" className="space-y-8">
                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground">Produtos da Empresa</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Conheça os produtos e soluções oferecidos por {company.name}
                        </CardDescription>
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
                          <div className="text-center py-12 bg-muted rounded-xl border border-border">
                            <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-8">
                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground">Avaliações dos Clientes</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Veja o que os clientes falam sobre {company.name}
                        </CardDescription>
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
                          <div className="text-center py-12 bg-muted rounded-xl border border-border">
                            <p className="text-muted-foreground">Nenhuma avaliação ainda.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-8">
                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground">Galeria de Projetos</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Veja alguns dos projetos realizados por {company.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {mockData.gallery.map((image, index) => (
                            <div 
                              key={index} 
                              className="relative group overflow-hidden rounded-xl shadow-sm"
                            >
                              <img
                                src={image}
                                alt={`Projeto ${index + 1}`}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <ExternalLink className="w-8 h-8 text-primary-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-8">
                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground">Estatísticas da Empresa</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Dados e números de destaque sobre {company.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {mockData.stats.map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              className="flex flex-col items-center text-center p-4 bg-muted rounded-xl"
                            >
                              <div className="flex justify-center mb-2">
                                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
                                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                              <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-md bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground">Visão Rápida</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Avaliação Média</span>
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                              <span className="font-bold text-lg text-foreground">{mockData.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total de Reviews</span>
                            <span className="font-bold text-lg text-foreground">{mockData.reviewCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Projetos Concluídos</span>
                            <span className="font-bold text-lg text-foreground">{mockData.completedProjects}+</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Anos no Mercado</span>
                            <span className="font-bold text-lg text-foreground">{mockData.yearsInBusiness}+</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <Card className="rounded-2xl shadow-lg bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-foreground">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-full">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          <p className="font-semibold text-foreground">{company.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-full">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-muted rounded-full mt-1">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Endereço</p>
                          <p className="font-semibold text-foreground">{company.address}</p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-border">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md transition-colors text-primary-foreground">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Solicitar Orçamento
                        </Button>
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