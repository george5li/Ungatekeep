'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching for outfits based on a description.
 *
 * - descriptiveOutfitSearch - The main function that orchestrates the descriptive outfit search process.
 * - DescriptiveOutfitSearchInput - The input type for the descriptiveOutfitSearch function.
 * - DescriptiveOutfitSearchOutput - The output type for the descriptiveOutfitSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchProducts } from '../tools/product-search';

const DescriptiveOutfitSearchInputSchema = z.object({
  description: z.string().describe('A description of the outfit to search for.'),
});

export type DescriptiveOutfitSearchInput = z.infer<typeof DescriptiveOutfitSearchInputSchema>;

const DescriptiveOutfitSearchOutputSchema = z.array(
    z.object({
      imageUrl: z.string().optional().describe('URL of the matching item image.'),
      link: z.string().describe('Link to purchase the item.'),
      description: z.string().describe('A short description of the item.'),
    })
);

export type DescriptiveOutfitSearchOutput = z.infer<typeof DescriptiveOutfitSearchOutputSchema>;

export async function descriptiveOutfitSearch(input: DescriptiveOutfitSearchInput): Promise<DescriptiveOutfitSearchOutput> {
  return descriptiveOutfitSearchFlow(input);
}

const descriptiveOutfitSearchPrompt = ai.definePrompt({
  name: 'descriptiveOutfitSearchPrompt',
  input: {schema: DescriptiveOutfitSearchInputSchema},
  output: {schema: DescriptiveOutfitSearchOutputSchema},
  tools: [searchProducts],
  prompt: `You are an AI fashion assistant. The user will provide a description of an outfit or clothing item.
  
  Use the productSearch tool with the user's description as the query to find items available for purchase online.
  
  Populate the output array with the results from the search tool. Instead of using the raw product title, generate a concise and helpful description for each item. Use the product url for the link, and the product imageUrl for the imageUrl.
  
  User's description: {{{description}}}

  Return a list of matching items.
  `,
});

const descriptiveOutfitSearchFlow = ai.defineFlow(
  {
    name: 'descriptiveOutfitSearchFlow',
    inputSchema: DescriptiveOutfitSearchInputSchema,
    outputSchema: DescriptiveOutfitSearchOutputSchema,
  },
  async input => {
    const {output} = await descriptiveOutfitSearchPrompt(input);
    return output!;
  }
);
