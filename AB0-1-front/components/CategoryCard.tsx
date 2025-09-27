'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
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

  const displayData = {
    id: category?.id,
    name: category?.name || 'Nome da Categoria',
    description: category?.short_description || category?.description || 'Categoria de energia solar.',
    banner_url: !imageError && category?.banner_url
      ? category.banner_url
      : "/images/category-placeholder.svg",
    seo_url: category?.seo_url ? `categories/${category.seo_url}` : `categories/${category.id}`
  };

  return (
    <motion.div
      className={`group relative flex flex-col h-full overflow-hidden rounded-xl bg-white
                  shadow-sm hover:shadow-lg transition-all duration-300
                  border border-gray-200 hover:border-blue-400 ${className}`}
      whileHover={{ y: -3 }}
    >
      <Link
        href={`/${displayData.seo_url}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes da categoria ${displayData.name}`}
      />

      {/* BANNER DA EMPRESA */}
      <div className="relative h-28 w-full overflow-hidden flex-shrink-0">
        {displayData.banner_url && !imageError ? (
          <Image
            src={displayData.banner_url}
            alt={`Banner da categoria ${displayData.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <Image
            src="/images/category-placeholder.svg"
            alt={`Banner da categoria ${displayData.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-3 flex flex-col flex-grow z-20">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
          {displayData.name}
        </h3>
        <p className="text-gray-700 text-sm mb-2 line-clamp-2 flex-grow">
          {displayData.description}
        </p>


        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500
                     hover:from-blue-600 hover:to-indigo-600 text-white
                     font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300
                     transform group-hover:scale-[1.01] text-sm py-1"
        >
          Ver detalhes
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}
