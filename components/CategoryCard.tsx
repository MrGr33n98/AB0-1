'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Package } from 'lucide-react';
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

  // Use real data from the API
  const displayData = {
    id: category?.id,
    name: category?.name || 'Nome da Categoria',
    description: category?.description || category?.short_description || 'Explore nossos produtos e serviços de alta qualidade.',
    companiesCount: category?.companies?.length || 0,
    productsCount: category?.products?.length || 0,
    banner_url: !imageError && category?.banner_url
      ? category.banner_url
      : "/images/category-placeholder.jpg"
  };

  return (
    <motion.div
      className={`group relative flex flex-col h-full overflow-hidden rounded-xl bg-white
                  shadow-sm hover:shadow-lg transition-all duration-300
                  border border-gray-200 hover:border-blue-400 ${className}`}
      whileHover={{ y: -3, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 4px 8px -5px rgba(0, 0, 0, 0.04)" }}
      style={{
        borderImageSlice: 1,
        borderImageSource: "linear-gradient(to right, #3b82f6, #60a5fa)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderImage: "initial"
      }}
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={displayData.name} />
      <meta itemProp="description" content={displayData.description} />
      
      <Link href={`/categories/${displayData.id || ''}`} className="absolute inset-0 z-10" aria-label={`Ver detalhes da categoria ${displayData.name}`}>
      </Link>

      {/* IMAGEM DA CATEGORIA */}
      <div className="relative h-32 w-full overflow-hidden flex-shrink-0">
        <Image
          src={displayData.banner_url}
          alt={`Banner da categoria ${displayData.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={false}
        />
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

        <div className="flex flex-wrap gap-1 mb-2 mt-auto">
          <Badge variant="outline" className="text-gray-600 bg-blue-50 border-blue-200 text-xs py-0">
            <Building2 className="h-3 w-3 mr-1 text-blue-500" />
            <span itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
              <meta itemProp="offerCount" content={displayData.companiesCount.toString()} />
              {displayData.companiesCount} {displayData.companiesCount === 1 ? 'empresa' : 'empresas'}
            </span>
          </Badge>
          <Badge variant="outline" className="text-gray-600 bg-indigo-50 border-indigo-200 text-xs py-0">
            <Package className="h-3 w-3 mr-1 text-indigo-500" />
            {displayData.productsCount} {displayData.productsCount === 1 ? 'produto' : 'produtos'}
          </Badge>
        </div>

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
