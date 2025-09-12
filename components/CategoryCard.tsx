'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Package } from 'lucide-react'; // Adicionei Building2 e Package para os ícones
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  description?: string;
  companies?: any[];
  products?: any[];
  banner_url?: string;
}

import { Button } from '@/components/ui/button'; // Certifique-se de que este Button seja flexível o suficiente para 'asChild'
import { Badge } from '@/components/ui/badge'; // Adicionando Badge para um estilo mais moderno nas estatísticas

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  const displayData = {
    name: category?.name || 'Nome da Categoria',
    description: category?.description || 'Explore nossos produtos e serviços de alta qualidade.',
    companiesCount: category?.companies?.length || 0,
    productsCount: category?.products?.length || 0,
    banner_url: !imageError && category?.banner_url
      ? category.banner_url
      : "/images/compare-solar-v1.png" // Fallback image
  };

  return (
    <motion.div
      className={`group relative flex flex-col h-full overflow-hidden rounded-xl bg-white
                  shadow-sm hover:shadow-lg transition-all duration-300
                  border border-gray-200 hover:border-orange-400 ${className}`}
      whileHover={{ y: -5, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)" }}
      // Adicionando um gradiente de borda sutil ao hover para um toque extra
      style={{
        borderImageSlice: 1,
        borderImageSource: "linear-gradient(to right, #fb923c, #fcd34d)", // Laranja para Amarelo
        borderWidth: "1px",
        borderStyle: "solid",
        borderImage: "initial"
      }}
    >
      <Link href={`/categories/${category?.id || ''}`} className="absolute inset-0 z-10" aria-label={`Ver detalhes da categoria ${displayData.name}`}>
        {/* Link principal para toda a área do card */}
      </Link>

      {/* IMAGEM DA CATEGORIA */}
      <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
        <Image
          src={displayData.banner_url}
          alt={`Banner de ${displayData.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={false} // Use priority para imagens acima da dobra, lazy para o resto
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        {/* Adicione um overlay sutil para texto legível sobre a imagem */}
      </div>

      {/* CONTEÚDO DA CATEGORIA */}
      <div className="p-5 flex flex-col flex-grow z-20"> {/* Z-index para conteúdo acima do link invisível */}
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
          {displayData.name}
        </h3>
        <p className="text-gray-700 text-base mb-4 line-clamp-3 flex-grow">
          {displayData.description}
        </p>

        {/* ESTATÍSTICAS COMO BADGES MODERNOS */}
        <div className="flex flex-wrap gap-2 mb-5 mt-auto"> {/* mt-auto para empurrar para o final */}
          <Badge variant="outline" className="text-gray-600 bg-orange-50 border-orange-200">
            <Building2 className="h-3 w-3 mr-1 text-orange-500" />
            {displayData.companiesCount} {displayData.companiesCount === 1 ? 'empresa' : 'empresas'}
          </Badge>
          <Badge variant="outline" className="text-gray-600 bg-green-50 border-green-200">
            <Package className="h-3 w-3 mr-1 text-green-500" />
            {displayData.productsCount} {displayData.productsCount === 1 ? 'produto' : 'produtos'}
          </Badge>
        </div>

        {/* BOTÃO DE DETALHES - Agora fora do Link principal, pois o Link principal já envolve tudo */}
        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500
                     hover:from-orange-600 hover:to-yellow-600 text-white
                     font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300
                     transform group-hover:scale-[1.01]"
          // onClick é redundante aqui se o link já está no card todo, mas mantido se houver necessidade específica
        >
          Ver detalhes
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}