'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'stylefind-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage', error);
      }
    }
  }, [favorites, isInitialized]);

  const addFavorite = useCallback(
    (product: Product) => {
      setFavorites((prev) => {
        if (prev.find((p) => p.id === product.id)) {
          return prev; // Already a favorite
        }
        toast({
          title: 'Added to Favorites',
          description: `${product.name} has been saved.`,
        });
        return [...prev, product];
      });
    },
    [toast]
  );

  const removeFavorite = useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        const product = prev.find((p) => p.id === productId);
        if (product) {
          toast({
            title: 'Removed from Favorites',
            description: `${product.name} has been removed.`,
            variant: 'destructive',
          });
        }
        return prev.filter((p) => p.id !== productId);
      });
    },
    [toast]
  );

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.some((p) => p.id === productId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, toggleFavorite, isFavorite, isInitialized };
}
