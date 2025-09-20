import { config } from 'dotenv';
config();

import '@/ai/flows/outfit-segmentation-and-item-matching.ts';
import '@/ai/flows/update-style-preferences.ts';
import '@/ai/flows/identify-outfit-style-and-recommend-pieces.ts';
import '@/ai/tools/product-search.ts';
