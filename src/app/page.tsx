'use client';

import { useState } from 'react';
import { Camera, FileText, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSearchForm from '@/components/ImageSearchForm';
import DescriptiveSearchForm from '@/components/DescriptiveSearchForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { Product } from '@/types';

export default function Home() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4">
          StyleFind AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover your next favorite outfit. Search with an image or describe a
          style, and let our AI do the rest.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">
              <Camera className="mr-2" />
              Visual Search
            </TabsTrigger>
            <TabsTrigger value="descriptive">
              <Sparkles className="mr-2" />
              Descriptive Search
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visual">
            <ImageSearchForm
              setResults={setResults}
              setLoading={setLoading}
              setError={setError}
              setSearchTriggered={setSearchTriggered}
              setUploadedImage={setUploadedImage}
            />
          </TabsContent>
          <TabsContent value="descriptive">
            <DescriptiveSearchForm
              setResults={setResults}
              setLoading={setLoading}
              setError={setError}
              setSearchTriggered={setSearchTriggered}
              setUploadedImage={setUploadedImage}
            />
          </TabsContent>
        </Tabs>
      </div>

      {searchTriggered && (
        <ResultsDisplay
          results={results}
          loading={loading}
          error={error}
          uploadedImage={uploadedImage}
        />
      )}
    </main>
  );
}
