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

  const rating = company.average_rating || company.rating_avg || '0.0';
  const totalReviews = company.reviews_count || company.rating_count || 0;
  const workingHours = company.working_hours || company.business_hours;
  const paymentMethods = Array.isArray(company.payment_methods)
    ? company.payment_methods.join(', ')
    : company.payment_methods || '';

  const firstCategory = company.categories?.[0]?.name || null;

  return (
    <Card className={`overflow-hidden h-full hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/companies/${company.id}`}>
        <CardContent className="p-0">
          <div 
            className="h-20 bg-cover bg-center relative overflow-hidden" 
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
              {rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{rating}</span>
                </div>
              )}
            </div>
            
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
            
            {workingHours && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Clock size={14} className="mr-1" />
                <span>{workingHours}</span>
              </div>
            )}

            {paymentMethods && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <CreditCard size={14} className="mr-1" />
                <span>{paymentMethods}</span>
              </div>
            )}

            {totalReviews > 0 && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MessageCircle size={14} className="mr-1" />
                <span>{totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}</span>
              </div>
            )}

            {company.social_links && (
              <div className="flex items-center gap-2 mt-2">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Globe size={14} />
                  </a>
                )}
                {company.social_links.facebook && (
                  <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Facebook size={14} />
                  </a>
                )}
                {company.social_links.instagram && (
                  <a href={company.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Instagram size={14} />
                  </a>
                )}
                {company.social_links.twitter && (
                  <a href={company.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                    <Twitter size={14} />
                  </a>
                )}
              </div>
            )}

            {firstCategory && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {firstCategory}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
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
