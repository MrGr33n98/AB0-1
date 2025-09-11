'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Globe, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/api';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export default function CompanyCard({ company, className = "" }: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mock data for demo - in real app this would come from API
  const mockData = {
    rating: 4.8,
    reviewCount: 127,
    tags: ['Residencial', 'Comercial', 'Instalação'],
    badges: ['Top Rated', 'Verified'],
    location: company.address?.split(',')[0] || 'São Paulo',
    projects: Math.floor(Math.random() * 200) + 50,
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with badges */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-4 right-4 flex gap-1">
          {mockData.badges.map((badge) => (
            <Badge
              key={badge}
              variant={badge === 'Top Rated' ? 'default' : 'secondary'}
              className={badge === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' : ''}
            >
              {badge === 'Top Rated' && <Star className="w-3 h-3 mr-1" />}
              {badge === 'Verified' && <Shield className="w-3 h-3 mr-1" />}
              {badge}
            </Badge>
          ))}
        </div>

        {/* Company Logo/Icon */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {company.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
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
              </div>
              <span className="text-sm font-medium text-gray-900">
                {mockData.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({mockData.reviewCount} reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{mockData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {company.description}
        </p>
      </div>

      {/* Tags */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-1">
          {mockData.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{mockData.projects}+ projetos</span>
          </div>
          <div className="flex items-center space-x-4">
            {company.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>Telefone</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <span>Website</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/companies/${company.id}`}>
            <Button
              variant="outline"
              className="w-full hover:border-orange-300 hover:text-orange-600"
            >
              Ver Perfil
            </Button>
          </Link>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
            Solicitar Orçamento
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