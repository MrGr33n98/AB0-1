'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, 
  Shield, 
  Zap, 
  Award, 
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProduct } from '@/hooks/useProducts';
import { useCompany } from '@/hooks/useCompanies';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewCard from '@/components/ReviewCard';
import ProductCard from '@/components/ProductCard';
import { reviewsApi, productsApi } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const { product, loading, error } = useProduct(productId);
  const { company } = useCompany(product?.company_id || 0);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data for demo
  const mockData = {
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.pexels.com/photos/9875456/pexels-photo-9875456.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/9875357/pexels-photo-9875357.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/9875425/pexels-photo-9875425.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    ],
    badges: ['Best Seller', 'Eco Friendly', '25 Anos Garantia'],
    specs: {
      'Potência': '500W',
      'Eficiência': '22.1%',
      'Tecnologia': 'Monocristalino',
      'Dimensões': '2108 x 1048 x 40mm',
      'Peso': '27.5kg',
      'Garantia': '25 anos',
      'Certificação': 'IEC 61215, IEC 61730',
      'Tolerância': '+3%/-0%'
    },
    features: [
      'Alta eficiência de conversão',
      'Resistente a condições climáticas extremas',
      'Baixa degradação anual',
      'Fácil instalação',
      'Tecnologia PERC avançada',
      'Certificado internacionalmente'
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '5-7 dias úteis',
      inStock: true
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!product) return;
      
      try {
        // Fetch reviews
        const allReviews = await reviewsApi.getAll();
        const productReviews = allReviews.filter(r => r.product_id === product.id);
        setReviews(productReviews);

        // Fetch related products
        const allProducts = await productsApi.getAll();
        const related = allProducts
          .filter(p => p.id !== product.id && p.company_id === product.company_id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchData();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Produto não encontrado</h2>
            <p className="text-red-600">O produto solicitado não existe ou foi removido.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <span>Produtos</span> / <span>Painéis Solares</span> / <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-md">
              <img
                src={mockData.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {mockData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === selectedImage ? 'bg-orange-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {mockData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImage ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {mockData.badges.map((badge) => (
                <Badge key={badge} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(mockData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">{mockData.rating}</span>
                  <span className="ml-1 text-gray-600">({mockData.reviewCount} reviews)</span>
                </div>
              </div>
              
              {company && (
                <p className="text-gray-600">
                  Por: <span className="font-medium text-orange-600">{company.name}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">por unidade</span>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-4">
                {mockData.shipping.inStock ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">Em estoque</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Indisponível</span>
                  </>
                )}
              </div>

              {/* Shipping Info */}
              {mockData.shipping.freeShipping && (
                <div className="flex items-center space-x-2 mb-6">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span className="text-green-600">Frete grátis - Entrega em {mockData.shipping.estimatedDays}</span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Solicitar Cotação
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={isFavorited ? 'text-red-500 border-red-200' : ''}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                    Favoritar
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Principais Características</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mockData.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="specs">Especificações</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockData.reviewCount})</TabsTrigger>
            <TabsTrigger value="qa">Perguntas</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-4">Características Principais:</h4>
                <ul className="space-y-2">
                  {mockData.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mockData.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
                    <p className="text-gray-600">Seja o primeiro a avaliar este produto!</p>
                    <Button className="mt-4">Escrever Avaliação</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-6">
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma pergunta ainda</h3>
                <p className="text-gray-600">Tem dúvidas sobre este produto? Faça sua pergunta!</p>
                <Button className="mt-4">Fazer Pergunta</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}