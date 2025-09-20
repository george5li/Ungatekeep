'use server';
/**
 * @fileOverview This file defines a Genkit flow for outfit segmentation and item matching.
 *
 * It allows users to upload an image of an outfit, identifies individual clothing items,
 * and finds visually similar items available for purchase online.
 *
 * - outfitSegmentationAndItemMatching - The main function that orchestrates the outfit segmentation and item matching process.
 * - OutfitSegmentationAndItemMatchingInput - The input type for the outfitSegmentationAndItemMatching function.
 * - OutfitSegmentationAndItemMatchingOutput - The output type for the outfitSegmentationAndItemMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {searchProducts} from '../tools/product-search';

const OutfitSegmentationAndItemMatchingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'." //Corrected typo here
    ),
  styleProfile: z.string().optional().describe('The style profile of the user.'),
});

export type OutfitSegmentationAndItemMatchingInput = z.infer<typeof OutfitSegmentationAndItemMatchingInputSchema>;

const OutfitSegmentationAndItemMatchingOutputSchema = z.object({
  segmentedItems: z.array(
    z.object({
      itemType: z.string().describe('The type of clothing item (e.g., shirt, pants, shoes).'),
      matchingItems: z.array(
        z.object({
          imageUrl: z.string().optional().describe('URL of the matching item image.'),
          link: z.string().describe('Link to purchase the item.'),
          description: z.string().describe('A short description of the item.'),
        })
      ),
    })
  ).
describe('A list of segmented items with their matching items.'),
  updatedStyleProfile: z.string().optional().describe('The updated style profile of the user based on the outfit.'),
  identifiedStyle: z.string().describe('The identified style of the outfit (e.g., casual, formal, bohemian).'),
  recommendedPieces: z.array(z.string()).describe('Recommended additional pieces based on the identified style.'),
});

export type OutfitSegmentationAndItemMatchingOutput = z.infer<typeof OutfitSegmentationAndItemMatchingOutputSchema>;

export async function outfitSegmentationAndItemMatching(input: OutfitSegmentationAndItemMatchingInput): Promise<OutfitSegmentationAndItemMatchingOutput> {
  return outfitSegmentationAndItemMatchingFlow(input);
}

const outfitSegmentationAndItemMatchingPrompt = ai.definePrompt({
  name: 'outfitSegmentationAndItemMatchingPrompt',
  input: {schema: OutfitSegmentationAndItemMatchingInputSchema},
  output: {schema: OutfitSegmentationAndItemMatchingOutputSchema},
  tools: [searchProducts],
  prompt: `You are an AI fashion assistant. You will analyze an image of an outfit and identify the individual clothing items.

  For each item, use the productSearch tool with a general query for the item type (e.g., 'mens black t-shirt', 'womens blue jeans') to find visually similar items available for purchase online. Populate the matchingItems array with the results from the search tool. Use the product title for the description, the product url for the link, and the product imageUrl for the imageUrl.

  Based on the outfit, identify the overall style (e.g., casual, formal, bohemian).
  Recommend additional pieces that would complement the outfit based on the identified style.
  Update the user's style profile based on the analyzed outfit.

  Here is the outfit image: {{media url=photoDataUri}}
  {{#if styleProfile}}Here is the user's current style profile: {{{styleProfile}}}{{/if}}
  Return the segmented items with matching items, the updated style profile, the identified style, and recommended pieces.
  `,
});

const outfitSegmentationAndItemMatchingFlow = ai.defineFlow(
  {
    name: 'outfitSegmentationAndItemMatchingFlow',
    inputSchema: OutfitSegmentationAndItemMatchingInputSchema,
    outputSchema: OutfitSegmentationAndItemMatchingOutputSchema,
  },
  async input => {
    const {output} = await outfitSegmentationAndItemMatchingPrompt(input);
    return output!;
  }
);
