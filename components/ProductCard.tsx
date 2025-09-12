import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
            {product.status === 'active' ? 'Available' : 'Unavailable'}
          </Badge>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {product.company?.name}
          </div>
          <div className="font-bold">
            ${typeof product.price === 'number' 
              ? product.price.toFixed(2) 
              : parseFloat(String(product.price)).toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}