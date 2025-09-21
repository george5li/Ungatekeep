
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, HeartOff, ShoppingCart } from 'lucide-react';
import type { FavoriteItem } from '@/hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-wider">
            Your Saved Items
          </h1>
          <p className="text-lg text-muted-foreground">
            Here are the pieces you've saved for later.
          </p>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item: FavoriteItem, index: number) => (
              <Card key={index} className="group h-full flex flex-col shadow-lg">
                <CardContent className="flex flex-col items-center justify-between p-4 gap-4 flex-1">
                  <div className="aspect-[4/5] w-full relative overflow-hidden rounded-lg">
                    <Image
                      src={item.imageUrl || 'https://picsum.photos/seed/1/400/500'}
                      alt={item.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="fashion clothing"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground flex-grow">{item.description}</p>
                  <div className="w-full space-y-2">
                    <Button asChild className="w-full">
                      <Link href={item.link} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="mr-2" /> View Item
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => removeFavorite(item.link)}>
                        <HeartOff className="mr-2" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-20 px-6 shadow-xl border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Your Favorites List is Empty</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Analyze an outfit and save items to see them here.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">Analyze an Outfit</Link>
                </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
