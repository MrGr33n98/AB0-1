'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Category } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Use actual counts if available, otherwise use fallbacks
  const companyCount = category.companies?.length || 0;
  const productCount = category.products?.length || 0;

  // Updated banner style logic - only use the banner URL without gradient fallback
  const bannerStyle = category?.banner_url 
    ? { backgroundImage: `url(${category.banner_url})` }
    : {};

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/categories/${category.id}`}>
        {/* Background with banner image only */}
        <div 
          className="relative h-32 overflow-hidden bg-cover bg-center"
          style={bannerStyle}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm">
            <div className="absolute inset-0 opacity-20"></div>
          </div>

          {/* Ícone */}
          <div className="absolute top-4 left-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Badge de destaque */}
          {category.featured && (
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                Destaque
              </div>
            </div>
          )}
        </div>

        {/* Rest of the component remains unchanged */}
        <div className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {category.name}
          </h3>

          {/* Rest of the component... */}
        </div>
      </Link>
    </motion.div>
  );
}
