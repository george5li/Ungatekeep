import Image from 'next/image';
import { AlertCircle, PackageOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import type { Product } from '@/types';

interface ResultsDisplayProps {
  results: Product[];
  loading: boolean;
  error: string | null;
  uploadedImage: string | null;
}

const ResultsDisplay = ({
  results,
  loading,
  error,
  uploadedImage,
}: ResultsDisplayProps) => {
  const SKELETON_COUNT = 6;

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-3xl font-headline mb-6 text-center">Finding your items...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20 mt-12 bg-card rounded-lg border border-dashed">
        <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No results found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search or a clearer image.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col md:flex-row gap-8">
        {uploadedImage && (
          <div className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-20">
              <h2 className="text-2xl font-headline mb-4">Your Image</h2>
              <div className="aspect-square relative w-full bg-card rounded-lg overflow-hidden border">
                <Image
                  src={uploadedImage}
                  alt="Uploaded outfit"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
        <div className={uploadedImage ? "md:w-2/3 lg:w-3/4" : "w-full"}>
           <h2 className="text-3xl font-headline mb-6">We found {results.length} items for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
