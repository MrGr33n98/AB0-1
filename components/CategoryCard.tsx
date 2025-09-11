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

  // Mock data for demo
  const mockData = {
    productCount: Math.floor(Math.random() * 150) + 20,
    companyCount: Math.floor(Math.random() * 50) + 10,
    image: `https://images.pexels.com/photos/9875456/pexels-photo-9875456.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop`,
    gradient: 'from-orange-400 to-yellow-400',
  };

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
        {/* Background Image/Gradient */}
        <div className="relative h-32 bg-gradient-to-br from-orange-400 to-yellow-400 overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          </div>
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Featured Badge */}
          {category.featured && (
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                Destaque
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {category.name}
          </h3>
          
          {category.short_description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.short_description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{mockData.productCount} produtos</span>
            <span>{mockData.companyCount} empresas</span>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-600">
              Explorar categoria
            </span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4 text-orange-600" />
            </motion.div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </Link>
    </motion.div>
  );
}