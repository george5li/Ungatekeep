"use server";

import { outfitSegmentationAndItemMatching } from "@/ai/flows/outfit-segmentation-and-item-matching";
import type { OutfitSegmentationAndItemMatchingOutput } from "@/ai/flows/outfit-segmentation-and-item-matching";

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
