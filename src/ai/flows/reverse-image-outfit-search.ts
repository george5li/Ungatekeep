'use server';
/**
 * @fileOverview Identifies clothing items in an image and provides purchase links.
 *
 * - reverseImageOutfitSearch - A function that takes an image of an outfit and returns identified clothing items with purchase links.
 * - ReverseImageOutfitSearchInput - The input type for the reverseImageOutfitSearch function.
 * - ReverseImageOutfitSearchOutput - The return type for the reverseImageOutfitSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseImageOutfitSearchInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of an outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type ReverseImageOutfitSearchInput = z.infer<
  typeof ReverseImageOutfitSearchInputSchema
>;

const ClothingItemSchema = z.object({
  name: z.string().describe('The name of the clothing item.'),
  description: z.string().describe('A description of the clothing item.'),
  purchaseLinks: z
    .array(z.string())
    .describe('Direct purchase links for the clothing item.'),
  thriftStoreRecommendations: z
    .array(z.string())
    .describe('Thrift store recommendations for the item, e.g. Depop links'),
});

const ReverseImageOutfitSearchOutputSchema = z.object({
  clothingItems: z.array(ClothingItemSchema).describe('The identified clothing items in the image.'),
});
export type ReverseImageOutfitSearchOutput = z.infer<
  typeof ReverseImageOutfitSearchOutputSchema
>;

export async function reverseImageOutfitSearch(
  input: ReverseImageOutfitSearchInput
): Promise<ReverseImageOutfitSearchOutput> {
  return reverseImageOutfitSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reverseImageOutfitSearchPrompt',
  input: {schema: ReverseImageOutfitSearchInputSchema},
  output: {schema: ReverseImageOutfitSearchOutputSchema},
  prompt: `You are an AI fashion assistant. Your task is to identify the clothing items in the image provided and return links to purchase similar items.

Analyze the image and identify each clothing item. For each item, provide a name, description, and an array of direct purchase links. Also include an array of thrift store recommendations like Depop when available.

Image: {{media url=photoDataUri}}
`,
});

const reverseImageOutfitSearchFlow = ai.defineFlow(
  {
    name: 'reverseImageOutfitSearchFlow',
    inputSchema: ReverseImageOutfitSearchInputSchema,
    outputSchema: ReverseImageOutfitSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
