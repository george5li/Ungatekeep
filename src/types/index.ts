export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  purchaseLinks: string[];
  thriftStoreRecommendations?: string[];
}
