'use server';

/**
 * @fileOverview A tool for searching for products online using Google Custom Search.
 *
 * - searchProducts - A function that searches for products based on a query.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getJson } from "google-search-results-nodejs";

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
  async (input) => {
    console.log(`Performing a web search for: "${input.query}"`);

    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.warn("Google Custom Search API key or Search Engine ID is not set. Returning mock data.");
      // Fallback to mock data if API keys are not provided
      const querySlug = input.query.toLowerCase().replace(/\s+/g, '-');
      return {
        results: [
          {
            title: `Classic ${input.query}`,
            url: `https://example.com/product/classic-${querySlug}`,
            imageUrl: `https://picsum.photos/seed/classic-${querySlug}/400/500`,
          },
          {
            title: `Modern ${input.query}`,
            url: `https://example.com/product/modern-${querySlug}`,
            imageUrl: `https://picsum.photos/seed/modern-${querySlug}/400/500`,
          },
        ],
      };
    }

    try {
      const response = await getJson({
        api_key: apiKey,
        q: `${input.query} clothing`,
        engine: "google",
        cx: searchEngineId,
        tbm: 'shop',
      });
      
      const shoppingResults = response.shopping_results || [];

      if (shoppingResults.length === 0) {
        console.warn("No shopping results found for query:", input.query);
        console.log("Full API Response:", JSON.stringify(response, null, 2));
      }

      const formattedResults = shoppingResults.slice(0, 5).map((item: any) => ({
        title: item.title,
        url: item.link,
        imageUrl: item.thumbnail,
      }));

      return { results: formattedResults };

    } catch (error) {
      console.error("Error calling Google Custom Search API:", error);
      return { results: [] };
    }
  }
);
