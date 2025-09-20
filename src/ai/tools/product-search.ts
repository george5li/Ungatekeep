'use server';

/**
 * @fileOverview A tool for searching for products online.
 *
 * - searchProducts - A function that searches for products based on a query.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const searchProducts = ai.defineTool(
  {
    name: 'productSearch',
    description: 'Search for products online.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          title: z.string().describe('The title of the product.'),
          url: z.string().describe('The URL of the product page.'),
          imageUrl: z.string().describe('The URL of the product image.'),
        })
      ),
    }),
  },
  async input => {
    // In a real application, you would implement a call to a product search API here.
    // For this prototype, we'll return some mock data.
    console.log(`Product search for: ${input.query}`);
    return {
      results: [
        {
          title: `Classic ${input.query}`,
          url: 'https://example.com/product/123',
          imageUrl: 'https://picsum.photos/seed/product1/400/500',
        },
        {
          title: `Modern ${input.query}`,
          url: 'https://example.com/product/456',
          imageUrl: 'https://picsum.photos/seed/product2/400/500',
        },
        {
          title: `Vintage ${input.query}`,
          url: 'https://example.com/product/789',
          imageUrl: 'https://picsum.photos/seed/product3/400/500',
        },
      ],
    };
  }
);
