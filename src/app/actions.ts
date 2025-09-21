"use server";

import { outfitSegmentationAndItemMatching } from "@/ai/flows/outfit-segmentation-and-item-matching";
import type { OutfitSegmentationAndItemMatchingOutput } from "@/ai/flows/outfit-segmentation-and-item-matching";
import { descriptiveOutfitSearch } from "@/ai/flows/descriptive-outfit-search";
import type { DescriptiveOutfitSearchOutput } from "@/ai/flows/descriptive-outfit-search";
import { generateStyledOutfitImage } from "@/ai/flows/generate-styled-outfit-image";
import type { GenerateStyledOutfitImageOutput } from "@/ai/flows/generate-styled-outfit-image";

export async function analyzeOutfit(
  photoDataUri: string,
  styleProfile: string
): Promise<{ success: true; data: OutfitSegmentationAndItemMatchingOutput } | { success: false; error: string }> {
  try {
    const result = await outfitSegmentationAndItemMatching({
      photoDataUri,
      styleProfile,
    });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: `Failed to analyze outfit: ${errorMessage}` };
  }
}

export async function searchByDescription(
  description: string
): Promise<{ success: true; data: DescriptiveOutfitSearchOutput } | { success: false; error: string }> {
  try {
    const result = await descriptiveOutfitSearch({ description });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: `Failed to search by description: ${errorMessage}` };
  }
}

export async function generateOutfitImage(
    style: string,
    recommendedPieces: string[]
): Promise<{ success: true; data: GenerateStyledOutfitImageOutput } | { success: false; error: string }> {
    try {
        const result = await generateStyledOutfitImage({ style, recommendedPieces });
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to generate image: ${errorMessage}` };
    }
}
