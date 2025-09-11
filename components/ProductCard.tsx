'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Zap, TrendingUp, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data for demo
  const mockData = {
    rating: 4.6,
    reviewCount: 89,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : null,
    originalPrice: product.price * 1.2,
    badges: ['Best Seller', 'Eco Friendly'],
    image: `https://images.pexels.com/photos/9875456/pexels-photo-9875456.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`,
    warranty: '25 anos',
    efficiency: '22.1%',
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={mockData.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {mockData.badges.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className={`text-xs ${
                badge === 'Best Seller' 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {badge === 'Best Seller' && <TrendingUp className="w-3 h-3 mr-1" />}
              {badge === 'Eco Friendly' && <Zap className="w-3 h-3 mr-1" />}
              {badge}
            </Badge>
          ))}
        </div>

        {/* Discount Badge */}
        {mockData.discount && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white">
              -{mockData.discount}%
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(mockData.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({mockData.reviewCount})
            </span>
          </div>
          <div className="flex items-center text-green-600">
            <Shield className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{mockData.warranty}</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Specs */}
        <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            <span>Eficiência: {mockData.efficiency}</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            <span>Garantia: {mockData.warranty}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              R$ {product.price.toFixed(2)}
            </span>
            {mockData.discount && (
              <span className="text-sm text-gray-500 line-through">
                R$ {mockData.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {mockData.discount && (
            <p className="text-sm text-green-600 font-medium">
              Economize R$ {(mockData.originalPrice - product.price).toFixed(2)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <Button
              variant="outline"
              className="w-full hover:border-orange-300 hover:text-orange-600"
            >
              Ver Detalhes
            </Button>
          </Link>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
            Solicitar Cotação
          </Button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}