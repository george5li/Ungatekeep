'use server';

/**
 * @fileOverview Identifies the style of an outfit and recommends additional pieces.
 *
 * - identifyOutfitStyleAndRecommendPieces - A function that takes a photo of an outfit and returns the identified style and recommended pieces.
 * - IdentifyOutfitStyleAndRecommendPiecesInput - The input type for the identifyOutfitStyleAndRecommendPieces function.
 * - IdentifyOutfitStyleAndRecommendPiecesOutput - The return type for the identifyOutfitStyleAndRecommendPieces function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyOutfitStyleAndRecommendPiecesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyOutfitStyleAndRecommendPiecesInput = z.infer<typeof IdentifyOutfitStyleAndRecommendPiecesInputSchema>;

const IdentifyOutfitStyleAndRecommendPiecesOutputSchema = z.object({
  style: z.string().describe('The identified style of the outfit.'),
  recommendedPieces: z.array(z.string()).describe('A list of recommended pieces to complement the outfit.'),
});
export type IdentifyOutfitStyleAndRecommendPiecesOutput = z.infer<typeof IdentifyOutfitStyleAndRecommendPiecesOutputSchema>;

export async function identifyOutfitStyleAndRecommendPieces(input: IdentifyOutfitStyleAndRecommendPiecesInput): Promise<IdentifyOutfitStyleAndRecommendPiecesOutput> {
  return identifyOutfitStyleAndRecommendPiecesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyOutfitStyleAndRecommendPiecesPrompt',
  input: {schema: IdentifyOutfitStyleAndRecommendPiecesInputSchema},
  output: {schema: IdentifyOutfitStyleAndRecommendPiecesOutputSchema},
  prompt: `You are a fashion expert. You will identify the style of the outfit in the photo and recommend additional pieces that would complement the outfit.

Consider the following when identifying the style and recommending pieces:

- The overall look and feel of the outfit.
- The individual pieces that make up the outfit.
- The colors and patterns used in the outfit.
- The current fashion trends.

Respond with a plain text style, and a plain text list of recommended pieces.

Photo: {{media url=photoDataUri}}`,
});

const identifyOutfitStyleAndRecommendPiecesFlow = ai.defineFlow(
  {
    name: 'identifyOutfitStyleAndRecommendPiecesFlow',
    inputSchema: IdentifyOutfitStyleAndRecommendPiecesInputSchema,
    outputSchema: IdentifyOutfitStyleAndRecommendPiecesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
