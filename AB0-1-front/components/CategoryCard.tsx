'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Building2, 
  Package, 
  ChevronRight,
  Eye,
  Zap,
  ShoppingBag
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayData = {
    id: category?.id,
    name: category?.name || 'Nome da Categoria',
    description: category?.short_description || category?.description || 'Categoria de energia solar.',
    banner_url: !imageError && category?.banner_url
      ? category.banner_url
      : "/images/category-placeholder.svg",
    seo_url: category?.seo_url ? `categories/${category.seo_url}` : `categories/${category.id}`,
    featured: category?.featured || false,
    status: category?.status || 'active',
    companies_count: category?.companies?.length || 0,
    products_count: category?.products?.length || 0
  };

  return (
    <motion.div
      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white
                  shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/60
                  border border-gray-200/60 hover:border-blue-300/60
                  backdrop-blur-sm transition-all duration-500 ease-out ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Featured Badge */}
      {displayData.featured && (
        <div className="absolute top-3 left-3 z-30">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white 
                         shadow-lg border-0 px-2 py-1 text-xs font-semibold">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Destaque
          </Badge>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-30">
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md
          ${displayData.status === 'active' 
            ? 'bg-green-100/90 text-green-700 border border-green-200/50' 
            : 'bg-gray-100/90 text-gray-600 border border-gray-200/50'
          }
        `}>
          <div className={`w-2 h-2 rounded-full inline-block mr-1 ${
            displayData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          {displayData.status === 'active' ? 'Ativo' : 'Inativo'}
        </div>
      </div>

      {/* Enhanced Banner Section */}
      <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
        {displayData.banner_url && !imageError ? (
          <Image
            src={displayData.banner_url}
            alt={`Banner da categoria ${displayData.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                         flex items-center justify-center relative overflow-hidden">
            {/* Animated background pattern - sem ícones, apenas formas geométricas */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-6 left-6 w-8 h-8 border-2 border-blue-400 rounded rotate-45 
                           animate-pulse group-hover:animate-spin transition-all duration-1000" />
              <div className="absolute bottom-8 right-8 w-6 h-6 border-2 border-indigo-400 rounded-full 
                           animate-bounce group-hover:animate-ping transition-all duration-1000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           w-16 h-16 border border-purple-300 rounded-lg rotate-12 
                           group-hover:rotate-45 transition-all duration-700" />
              <div className="absolute top-8 right-12 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 
                           rounded rotate-45 animate-pulse group-hover:animate-bounce" />
              <div className="absolute bottom-12 left-12 w-10 h-2 bg-gradient-to-r from-indigo-300 to-blue-300 
                           rounded-full opacity-60 group-hover:opacity-100 transition-all duration-500" />
            </div>
            
            {/* Texto centralizado elegante sem ícones específicos */}
            <div className="text-center z-10">
              <div className="w-20 h-20 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 
                           flex items-center justify-center transition-all duration-500 
                           group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 
                             flex items-center justify-center shadow-inner">
                  <div className="text-white font-bold text-lg">
                    {displayData.name.charAt(0)}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-blue-600/80 group-hover:text-blue-700 transition-colors">
                {displayData.name.split(' ')[0]}
              </p>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                       opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Enhanced Content Section */}
      <div className="p-5 flex flex-col flex-grow z-20 relative">
        {/* Title with enhanced typography */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight 
                        group-hover:text-blue-900 transition-colors duration-300">
            {displayData.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-grow">
            {displayData.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 mb-4 py-3 px-4 rounded-xl bg-gray-50/50 
                       border border-gray-100 transition-all duration-300 
                       group-hover:bg-blue-50/50 group-hover:border-blue-100">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-200 
                           transition-colors duration-300">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-gray-900">{displayData.companies_count}</span>
              <span className="text-gray-500 ml-1">empresas</span>
            </div>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-green-100 text-green-600 group-hover:bg-green-200 
                           transition-colors duration-300">
              <Package className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-gray-900">{displayData.products_count}</span>
              <span className="text-gray-500 ml-1">produtos</span>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
                     hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
                     text-white font-semibold rounded-xl shadow-lg shadow-blue-200/50
                     hover:shadow-xl hover:shadow-blue-300/60 transition-all duration-300
                     border-0 h-11 relative overflow-hidden group/btn"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 
                           translate-x-[-100%] group-hover/btn:translate-x-[100%] 
                           transition-transform duration-700 ease-out" />
            
            <div className="relative flex items-center justify-center gap-2">
              <Eye className="h-4 w-4 transition-all duration-300 group-hover/btn:scale-110" />
              <span className="transition-all duration-300">Explorar Categoria</span>
              <ChevronRight className="h-4 w-4 transition-all duration-300 
                                     group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
            </div>
          </Button>
        </motion.div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent
                        rounded-2xl transition-opacity duration-500 pointer-events-none
                        ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Link Overlay - mantém a navegação original */}
      <Link
        href={`/${displayData.seo_url}`}
        className="absolute inset-0 z-40"
        aria-label={`Ver detalhes da categoria ${displayData.name}`}
      />

      {/* Subtle Animation Elements */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                        transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </motion.div>
  );
}
