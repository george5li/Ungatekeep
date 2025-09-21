'use server';

/**
 * @fileOverview A Genkit flow for generating a styled outfit image.
 *
 * - generateStyledOutfitImage - The main function that orchestrates the image generation.
 * - GenerateStyledOutfitImageInput - The input type for the function.
 * - GenerateStyledOutfitImageOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStyledOutfitImageInputSchema = z.object({
  style: z.string().describe('The overall style of the outfit (e.g., casual, formal, bohemian).'),
  recommendedPieces: z.array(z.string()).describe('A list of recommended pieces to include in the outfit.'),
});

export type GenerateStyledOutfitImageInput = z.infer<typeof GenerateStyledOutfitImageInputSchema>;

const GenerateStyledOutfitImageOutputSchema = z.object({
  imageUrl: z.string().describe("URL of the generated outfit image as a data URI."),
});

export type GenerateStyledOutfitImageOutput = z.infer<typeof GenerateStyledOutfitImageOutputSchema>;

export async function generateStyledOutfitImage(input: GenerateStyledOutfitImageInput): Promise<GenerateStyledOutfitImageOutput> {
  return generateStyledOutfitImageFlow(input);
}


const generateStyledOutfitImageFlow = ai.defineFlow(
  {
    name: 'generateStyledOutfitImageFlow',
    inputSchema: GenerateStyledOutfitImageInputSchema,
    outputSchema: GenerateStyledOutfitImageOutputSchema,
  },
  async ({ style, recommendedPieces }) => {
    const prompt = `Generate a high-quality, full-body fashion photograph of a person. The outfit should be in the '${style}' style and must include the following pieces: ${recommendedPieces.join(', ')}. The setting should be a clean, minimalist studio background. The image should be photorealistic.`;
    
    console.log("Generating image with prompt:", prompt);

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
      config: {
        aspectRatio: '9:16',
      }
    });

    if (!media.url) {
        throw new Error("Image generation failed to return a URL.");
    }
    
    return { imageUrl: media.url };
  }
);
