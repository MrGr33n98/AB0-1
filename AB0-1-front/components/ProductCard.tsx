import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const priceValue =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price || '0');

  const statusLabel =
    product.status === 'active'
      ? 'Disponível'
      : product.status === 'inactive'
      ? 'Indisponível'
      : 'Não informado';

  const statusVariant =
    product.status === 'active'
      ? 'default'
      : product.status === 'inactive'
      ? 'secondary'
      : 'outline';

  const displayImage =
    !imageError && product.image_url
      ? product.image_url
      : '/images/product-placeholder.jpg';

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full transition-all hover:shadow-md flex flex-col overflow-hidden">
        
        {/* IMAGEM DO PRODUTO */}
        <div className="relative w-full h-40">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </CardHeader>

        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.short_description || product.description || 'Sem descrição'}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground truncate">
            {product.company?.name}
          </div>
          <div className="font-bold">
            R$ {priceValue.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
