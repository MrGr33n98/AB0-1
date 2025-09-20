'use client';

import Link from 'next/link';
import {
  Star, MapPin, MessageCircle, Phone, Globe,
  Clock, CreditCard, Facebook, Instagram, Twitter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  company: Company;
  className?: string;
}

export default function CompanyCard({ company, className = '' }: Props) {
  if (!company) return (
    <Card className={`overflow-hidden h-full ${className}`}>
      <CardContent className="p-4 text-gray-500">Company data not available</CardContent>
    </Card>
  );

  const {
    id, name, city, state, description, about, working_hours, business_hours,
    payment_methods, reviews_count, rating_count, average_rating, rating_avg,
    categories, website, social_links, banner_url, logo_url
  } = company;

  const rating = average_rating || rating_avg || '0.0';
  const totalReviews = reviews_count || rating_count || 0;
  const workingHours = working_hours || business_hours;
  const payments = Array.isArray(payment_methods) ? payment_methods.join(', ') : payment_methods || '';
  const category = categories?.[0]?.name;
  const banner = banner_url || '/images/default-banner.jpg';
  const logo = logo_url || null;

  return (
    <Card className={`overflow-hidden h-full hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/companies/${id}`}>
        <CardContent className="p-0">
          {/* Banner */}
          <div className="h-20 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {logo ? (
                  <img src={logo} alt={name} className="w-12 h-12 rounded-full mr-3 border" />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">{name?.charAt(0) || '?'}</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{name}</h3>
              </div>
              {rating && (
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {rating}
                </div>
              )}
            </div>

            {/* Localização */}
            {(city || state) && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MapPin size={14} className="mr-1" />
                {city && state ? `${city} - ${state}` : city || state}
              </div>
            )}

            {/* Descrição */}
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{about || description || 'No description'}</p>

            {/* Info extra */}
            {workingHours && <Info icon={Clock} text={workingHours} />}
            {payments && <Info icon={CreditCard} text={payments} />}
            {totalReviews > 0 && <Info icon={MessageCircle} text={`${totalReviews} ${totalReviews === 1 ? 'avaliação' : 'avaliações'}`} />}

            {/* Links sociais */}
            {social_links && (
              <div className="flex items-center gap-2 mt-2 text-blue-500">
                {website && <SocialLink href={website} icon={Globe} />}
                {social_links.facebook && <SocialLink href={social_links.facebook} icon={Facebook} />}
                {social_links.instagram && <SocialLink href={social_links.instagram} icon={Instagram} />}
                {social_links.twitter && <SocialLink href={social_links.twitter} icon={Twitter} />}
              </div>
            )}

            {/* Categoria */}
            {category && <Badge variant="outline" className="mt-3 text-xs">{category}</Badge>}
          </div>
        </CardContent>
      </Link>

      <div className="px-4 pb-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/companies/${id}/review`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Deixar Avaliação
          </Link>
        </Button>
      </div>
    </Card>
  );
}

/* Components auxiliares para reduzir código */
const Info = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center text-sm text-gray-500 mt-2">
    <Icon size={14} className="mr-1" />
    <span>{text}</span>
  </div>
);

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
    <Icon size={14} />
  </a>
);
