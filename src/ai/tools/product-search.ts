'use server';

/**
 * @fileOverview A tool for searching for products online using Google Custom Search.
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
  async (input) => {
    console.log(`Performing a web search for: "${input.query}"`);

    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      const errorMessage = "Google Custom Search API key or Search Engine ID is not set in the .env file.";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const searchParams = new URLSearchParams({
        key: apiKey,
        cx: searchEngineId,
        q: `${input.query} clothing`,
        tbm: 'shop',
      });
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorBody = await response.json();
        const apiErrorMessage = errorBody?.error?.message || 'Unknown API error';
        console.error("Error calling Google Custom Search API:", apiErrorMessage);
        throw new Error(`The product search failed: ${apiErrorMessage}`);
      }
      
      const data = await response.json();

      const shoppingResults = data.items || [];

      if (shoppingResults.length === 0) {
        console.warn("No shopping results found for query:", input.query);
        return { results: [] };
      }

      const formattedResults = shoppingResults.slice(0, 5).map((item: any) => ({
        title: item.title,
        url: item.link,
        imageUrl: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.product?.[0]?.image,
      }));

      return { results: formattedResults };

    } catch (error) {
      console.error("Error during product search fetch:", error);
      throw new Error(`The product search failed. Please check your API keys and configuration. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
