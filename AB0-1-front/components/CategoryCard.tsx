'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/api';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export default function CompanyCard({ company, className = "" }: CompanyCardProps) {
  const [imageError, setImageError] = useState(false);

  const displayData = {
    id: company?.id,
    name: company?.name || 'Nome da Empresa',
    description: company?.about || 'Empresa especializada em energia solar.',
    rating: company?.rating_avg ?? 0,
    totalReviews: company?.rating_count ?? 0,
    banner_url: !imageError && company?.banner_url
      ? company.banner_url
      : "/images/company-placeholder.jpg",
    seo_url: company?.id ? `companies/${company.id}` : "#"
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
        aria-label={`Ver detalhes da empresa ${displayData.name}`}
      />

      {/* BANNER DA EMPRESA */}
      <div className="relative h-28 w-full overflow-hidden flex-shrink-0">
        <Image
          src={displayData.banner_url}
          alt={`Banner da empresa ${displayData.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
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

        {/* Avaliação */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-600">
            {displayData.rating.toFixed(1)} ({displayData.totalReviews} avaliações)
          </span>
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
