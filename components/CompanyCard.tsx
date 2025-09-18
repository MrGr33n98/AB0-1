'use client';

import Link from 'next/link';
import { Star, MapPin, MessageCircle, Phone, Globe, Clock, CreditCard, Facebook, Instagram, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface CompanyCardProps {
  company: Company;
  className?: string;
  showCtas?: boolean;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

interface CompanyCta {
  key: string;
  label: string;
  type: string;
  url: string;
  icon?: string;
  style: string;
  priority: number;
  analytics_event?: string;
}

export default function CompanyCard({ company, className = '' }: CompanyCardProps) {
  if (!company) {
    return (
      <Card className={`overflow-hidden h-full ${className}`}>
        <CardContent className="p-0">
          <div className="p-4">
            <p className="text-gray-500">Company data not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden h-full hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/companies/${company.id}`}>
        <CardContent className="p-0">
          <div 
            className="h-32 bg-cover bg-center relative overflow-hidden" 
            style={{ 
              backgroundImage: company.banner_url && company.banner_url.trim()
                ? `url(${company.banner_url})` 
                : 'url(/images/default-banner.jpg)',
              backgroundColor: '#f3f4f6'
            }}
          />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={company.name} 
                    className="w-12 h-12 rounded-full mr-3 border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">
                      {company.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{company.name}</h3>
              </div>
              {company.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{company.rating}</span>
                </div>
              )}
            </div>
            
            {/* Location info */}
            {(company.city || company.state) && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MapPin size={14} className="mr-1" />
                {company.city && company.state 
                  ? `${company.city} - ${company.state}` 
                  : company.city || company.state}
              </div>
            )}
            
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {company.description || 'No description available'}
            </p>
            
            {/* Business Hours */}
            {company.business_hours && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Clock size={14} className="mr-1" />
                <span>{company.business_hours}</span>
              </div>
            )}

            {/* Payment Methods */}
            {company.payment_methods && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <CreditCard size={14} className="mr-1" />
                <span>{company.payment_methods.join(', ')}</span>
              </div>
            )}

            {/* Total Reviews */}
            {company.total_reviews > 0 && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MessageCircle size={14} className="mr-1" />
                <span>{company.total_reviews} {company.total_reviews === 1 ? 'avaliação' : 'avaliações'}</span>
              </div>
            )}

            {/* Social Links */}
            {(company.social_links || company.website) && (
              <div className="flex items-center gap-2 mt-2">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Globe size={14} />
                  </a>
                )}
                {company.social_links?.facebook && (
                  <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Facebook size={14} />
                  </a>
                )}
                {company.social_links?.instagram && (
                  <a href={company.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Instagram size={14} />
                  </a>
                )}
                {company.social_links?.twitter && (
                  <a href={company.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Twitter size={14} />
                  </a>
                )}
              </div>
            )}

            {company.category_name && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {company.category_name}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      {/* Botão para deixar avaliação */}
      <div className="px-4 pb-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/companies/${company.id}/review`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Deixar Avaliação
          </Link>
        </Button>
      </div>
    </Card>
  );
}