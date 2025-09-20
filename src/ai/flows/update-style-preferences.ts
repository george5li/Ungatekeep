'use server';

/**
 * @fileOverview A flow to update user style preferences based on uploaded outfit images.
 *
 * - updateStylePreferences - Updates style preferences based on outfit image and description.
 * - UpdateStylePreferencesInput - The input type for the updateStylePreferences function.
 * - UpdateStylePreferencesOutput - The return type for the updateStylePreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateStylePreferencesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  description: z.string().describe('A description of the outfit.'),
  currentPreferences: z
    .string()
    .describe(
      'The current style preferences of the user, as a JSON string.'
    ),
});
export type UpdateStylePreferencesInput = z.infer<
  typeof UpdateStylePreferencesInputSchema
>;

const UpdateStylePreferencesOutputSchema = z.object({
  updatedPreferences: z
    .string()
    .describe(
      'The updated style preferences of the user, as a JSON string.'
    ),
});
export type UpdateStylePreferencesOutput = z.infer<
  typeof UpdateStylePreferencesOutputSchema
>;

export async function updateStylePreferences(
  input: UpdateStylePreferencesInput
): Promise<UpdateStylePreferencesOutput> {
  return updateStylePreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateStylePreferencesPrompt',
  input: {schema: UpdateStylePreferencesInputSchema},
  output: {schema: UpdateStylePreferencesOutputSchema},
  prompt: `You are an AI fashion stylist. Given a photo of an outfit and a
 description, you will analyze the outfit and update the user\'s style
 preferences accordingly.  The current user preferences are: {{{currentPreferences}}}.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Based on this outfit, how would you update the user\'s style preferences? Return the updated preferences as a JSON string. Be sure to include any style keywords associated with the outfit in the updated preferences.

Ensure that the output is a valid JSON string.
`, // Added a system message and instructions for output format
});

const updateStylePreferencesFlow = ai.defineFlow(
  {
    name: 'updateStylePreferencesFlow',
    inputSchema: UpdateStylePreferencesInputSchema,
    outputSchema: UpdateStylePreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
