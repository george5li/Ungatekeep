"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'ungatekeepFavorites';

export type FavoriteItem = {
  imageUrl?: string;
  link: string;
  description: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${FAVORITES_KEY}”:`, error);
    }
  }, []);

  const saveFavorites = (items: FavoriteItem[]) => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
      setFavorites(items);
    } catch (error) {
      console.warn(`Error setting localStorage key “${FAVORITES_KEY}”:`, error);
    }
  };

  const addFavorite = useCallback((item: FavoriteItem) => {
    const newFavorites = [...favorites, item];
    saveFavorites(newFavorites);
  }, [favorites]);

  const removeFavorite = useCallback((link: string) => {
    const newFavorites = favorites.filter((fav) => fav.link !== link);
    saveFavorites(newFavorites);
  }, [favorites]);

  const isFavorite = useCallback((link: string) => {
    return favorites.some((fav) => fav.link === link);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
