// src/ai/flows/descriptive-shopping-recommendations.ts
'use server';

/**
 * @fileOverview Generates shopping recommendations based on a descriptive prompt.
 *
 * This file exports:
 * - `generateShoppingRecommendations`: An async function that takes a descriptive prompt as input and returns shopping recommendations.
 * - `DescriptiveShoppingRecommendationsInput`: The input type for the generateShoppingRecommendations function.
 * - `DescriptiveShoppingRecommendationsOutput`: The output type for the generateShoppingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescriptiveShoppingRecommendationsInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt about the style of clothing the user is looking for.'),
});
export type DescriptiveShoppingRecommendationsInput = z.infer<typeof DescriptiveShoppingRecommendationsInputSchema>;

const DescriptiveShoppingRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      item: z.string().describe('A recommended clothing item.'),
      description: z.string().describe('A description of the clothing item.'),
      link: z.string().url().describe('A link to purchase the clothing item.'),
    })
  ).describe('An array of shopping recommendations.'),
});
export type DescriptiveShoppingRecommendationsOutput = z.infer<typeof DescriptiveShoppingRecommendationsOutputSchema>;

export async function generateShoppingRecommendations(input: DescriptiveShoppingRecommendationsInput): Promise<DescriptiveShoppingRecommendationsOutput> {
  return descriptiveShoppingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'descriptiveShoppingRecommendationsPrompt',
  input: {schema: DescriptiveShoppingRecommendationsInputSchema},
  output: {schema: DescriptiveShoppingRecommendationsOutputSchema},
  prompt: `You are a personal shopping assistant. A user will provide a
  description of the style of clothing they are looking for, and you will
  provide shopping recommendations that align with their preferences.

  User description: {{{prompt}}}

  Return an array of recommendations. For each recommendation, include the item name, a short description of the item, and a link to purchase the item.
  The link should be a real link to a real product.
  Do not include recommendations for items that are not available for purchase online.
  Do not include recommendations for items that are not related to the user's description.
  Do not include recommendations for items that are not clothing.
  Do not include recommendations for items that are not appropriate for the user's age or gender.
  Do not include recommendations for items that are not safe or legal.
  Do not include recommendations for items that are not in stock.
`,
});

const descriptiveShoppingRecommendationsFlow = ai.defineFlow(
  {
    name: 'descriptiveShoppingRecommendationsFlow',
    inputSchema: DescriptiveShoppingRecommendationsInputSchema,
    outputSchema: DescriptiveShoppingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
