'use server';
import {
  generateShoppingRecommendations,
  DescriptiveShoppingRecommendationsInput,
} from '@/ai/flows/descriptive-shopping-recommendations';
import {
  reverseImageOutfitSearch,
  ReverseImageOutfitSearchInput,
} from '@/ai/flows/reverse-image-outfit-search';
import type { Product } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

function getPlaceholder(name: string): { imageUrl: string; imageHint: string } {
  const lowerCaseName = name.toLowerCase();
  const found = PlaceHolderImages.find(p => lowerCaseName.includes(p.id));
  if (found) {
    return { imageUrl: found.imageUrl, imageHint: found.imageHint };
  }
  const generic = PlaceHolderImages.find(p => p.id === 'generic-clothing');
  return { imageUrl: generic!.imageUrl, imageHint: generic!.imageHint };
}

export async function handleImageSearch(
  input: ReverseImageOutfitSearchInput
): Promise<Product[]> {
  try {
    const result = await reverseImageOutfitSearch(input);
    if (!result || !result.clothingItems) {
      return [];
    }

    return result.clothingItems.map((item) => {
      const placeholder = getPlaceholder(item.name);
      return {
        id: crypto.randomUUID(),
        name: item.name,
        description: item.description,
        purchaseLinks: item.purchaseLinks,
        thriftStoreRecommendations: item.thriftStoreRecommendations,
        imageUrl: placeholder.imageUrl,
        imageHint: placeholder.imageHint,
      };
    });
  } catch (error) {
    console.error('Error in handleImageSearch:', error);
    throw new Error('Failed to perform image search. Please try again.');
  }
}

export async function handleDescriptiveSearch(
  input: DescriptiveShoppingRecommendationsInput
): Promise<Product[]> {
  try {
    const result = await generateShoppingRecommendations(input);
    if (!result || !result.recommendations) {
      return [];
    }
    return result.recommendations.map((item) => {
      const placeholder = getPlaceholder(item.item);
      return {
        id: crypto.randomUUID(),
        name: item.item,
        description: item.description,
        purchaseLinks: [item.link],
        imageUrl: placeholder.imageUrl,
        imageHint: placeholder.imageHint,
      };
    });
  } catch (error) {
    console.error('Error in handleDescriptiveSearch:', error);
    throw new Error('Failed to perform descriptive search. Please try again.');
  }
}
