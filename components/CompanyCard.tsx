'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, MessageCircle, Phone, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/api';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export default function CompanyCard({ company, className = '' }: CompanyCardProps) {
  const mockData = {
    rating: 4.7, // Valor fixo para se assemelhar à imagem
    reviewCount: 134, // Valor fixo para se assemelhar à imagem
    isVerified: true,
    isTopRated: true,
    logo: company.logo_url || `https://source.unsplash.com/random/100x100?logo&sig=${company.id}`,
    // A imagem de referência não mostra um banner, então vamos ajustar a altura
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 h-full flex flex-col hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Banner/Header Section - Baseado na imagem */}
      <div className="relative w-full h-32 bg-orange-100/50">
        {/* Placeholder para a logo SolarReview */}
        <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-5">
            {/* O "SolarReview" é parte do design, não da lógica. Usando um placeholder. */}
            <span className="text-5xl font-extrabold text-orange-200">SolarReview</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pt-0 relative flex flex-col">
        {/* Company Logo - Posicionada com base na imagem */}
        <div className="absolute -top-12 left-6">
          <img
            src={mockData.logo}
            alt={`${company.name} logo`}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover"
          />
        </div>

        {/* Company Info */}
        <div className="flex flex-col mt-16 text-left">
          <Link href={`/companies/${company.id}`} className="block">
            <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-orange-600 transition-colors">
              {company.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-sm mb-2">By Felipe Henrique</p> {/* Nome de mock como na imagem */}
          
          {/* Rating */}
          <div className="flex items-center text-sm mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-bold text-gray-800">{mockData.rating.toFixed(1)}</span>
            <span className="ml-1 text-gray-500">({mockData.reviewCount} Reviews)</span>
          </div>

          {/* Address */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{company.address}</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="mt-auto flex flex-col space-y-3">
          <Link href={`/companies/${company.id}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md">
              Ver Perfil
            </Button>
          </Link>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md">
            Solicitar Orçamento
          </Button>
          <Button 
            variant="outline"
            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Avalie essa empresa
          </Button>
        </div>
      </div>
    </motion.div>
  );
}