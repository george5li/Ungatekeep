'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFavorited = isFavorite(product.id);

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      <CardHeader className="p-0">
        <div className="aspect-[4/5] relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.imageHint}
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/70 hover:bg-background"
            onClick={() => toggleFavorite(product)}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all',
                isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl leading-tight mb-1 truncate">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" /> View Purchase Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {product.purchaseLinks.map((link, index) => (
              <DropdownMenuItem key={index} onSelect={() => openLink(link)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Shop New #{index + 1}</span>
              </DropdownMenuItem>
            ))}
            {product.thriftStoreRecommendations && product.thriftStoreRecommendations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {product.thriftStoreRecommendations.map((link, index) => (
                  <DropdownMenuItem key={index} onSelect={() => openLink(link)}>
                     <ThumbsUp className="mr-2 h-4 w-4" />
                    <span>Shop Thrifted #{index + 1}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
