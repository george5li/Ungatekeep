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
          imageUrl: z.string().optional().describe('The URL of the product image.'),
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
        q: `${input.query}`,
        searchType: 'image', // Required for image-based searches, which is what shopping results rely on
        tbm: 'shop',
      });
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorBody = await response.json();
        const apiErrorMessage = errorBody?.error?.message || 'Unknown API error';
        console.error("Error calling Google Custom Search API:", apiErrorMessage);
        // Provide a more descriptive error message to the user
        if (response.status === 404) {
            throw new Error(`The product search failed: Requested entity was not found. Please verify your Search Engine ID and ensure 'Shopping search' is enabled in the control panel.`);
        }
        throw new Error(`The product search failed: ${apiErrorMessage}`);
      }
      
      const data = await response.json();

      // The shopping results are in the 'items' array when using tbm=shop
      const shoppingResults = data.items || [];

      if (shoppingResults.length === 0) {
        console.warn("No shopping results found for query:", input.query);
        // Return an empty array instead of throwing an error, as this is not a technical failure.
        return { results: [] };
      }

      const formattedResults = shoppingResults
        .map((item: any) => {
          const imageUrl = item.pagemap?.cse_image?.[0]?.src || item.pagemap?.product?.[0]?.image;
          return {
            title: item.title,
            url: item.link,
            imageUrl: imageUrl,
          };
        });

      return { results: formattedResults.slice(0, 5) };

    } catch (error) {
      console.error("Error during product search fetch:", error);
      // Re-throw the error to be caught by the action and displayed in the UI
      throw error;
    }
  }
);
