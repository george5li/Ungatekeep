'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavoritesPage() {
  const { favorites, isInitialized } = useFavorites();

  if (!isInitialized) {
    return null; // or a loading skeleton
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4 flex items-center">
          <Heart className="mr-4 h-12 w-12 text-red-500" />
          Your Favorites
        </h1>
        <p className="text-lg text-muted-foreground">
          All your saved styles in one place.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start searching and add items you love.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
