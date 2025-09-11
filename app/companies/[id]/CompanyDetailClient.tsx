'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
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
  ThumbsUp
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

  // Mock data for demo
  const mockData = {
    rating: 4.8,
    reviewCount: 127,
    completedProjects: 450,
    yearsInBusiness: 8,
    certifications: ['INMETRO', 'ABNT', 'ISO 9001'],
    badges: ['Top Rated 2025', 'Verified Company', 'Industry Leader'],
    coverImage: 'https://images.pexels.com/photos/9875456/pexels-photo-9875456.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-orange-500 to-yellow-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20">
          <img
            src={mockData.coverImage}
            alt={company.name}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-3xl"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {mockData.badges.map((badge) => (
                <Badge key={badge} className="bg-white/20 text-white border-white/30">
                  {badge}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.name}</h1>
            <p className="text-xl mb-6 text-white/90">{company.description}</p>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(mockData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{mockData.rating}</span>
                <span className="text-white/80 ml-1">({mockData.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{company.address}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <MessageCircle className="mr-2 h-5 w-5" />
                Solicitar Orçamento
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Phone className="mr-2 h-5 w-5" />
                {company.phone}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mockData.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="products">Produtos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="gallery">Galeria</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sobre a Empresa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {company.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Serviços Oferecidos</h4>
                          <ul className="space-y-2">
                            {mockData.services.map((service) => (
                              <li key={service} className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Certificações</h4>
                          <div className="flex flex-wrap gap-2">
                            {mockData.certifications.map((cert) => (
                              <Badge key={cert} variant="secondary" className="text-sm">
                                <Shield className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Produtos da Empresa</CardTitle>
                      <CardDescription>
                        Conheça os produtos e soluções oferecidos por {company.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {productsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-80 rounded-xl" />
                          ))}
                        </div>
                      ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">Nenhum produto cadastrado ainda.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avaliações dos Clientes</CardTitle>
                      <CardDescription>
                        Veja o que os clientes falam sobre {company.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reviewsLoading ? (
                        <div className="space-y-6">
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-xl" />
                          ))}
                        </div>
                      ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">Nenhuma avaliação ainda.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Galeria de Projetos</CardTitle>
                      <CardDescription>
                        Veja alguns dos projetos realizados por {company.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockData.gallery.map((image, index) => (
                          <div key={index} className="relative group overflow-hidden rounded-lg">
                            <img
                              src={image}
                              alt={`Projeto ${index + 1}`}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <ExternalLink className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium">{company.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-orange-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Solicitar Orçamento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avaliação Média</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{mockData.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Reviews</span>
                      <span className="font-semibold">{mockData.reviewCount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projetos Concluídos</span>
                      <span className="font-semibold">{mockData.completedProjects}+</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anos no Mercado</span>
                      <span className="font-semibold">{mockData.yearsInBusiness}+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}