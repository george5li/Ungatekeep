"use client";

import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { OutfitSegmentationAndItemMatchingOutput } from '@/ai/flows/outfit-segmentation-and-item-matching';


function LoadingSkeleton() {
    return (
        <div className="space-y-12 animate-pulse">
            <Card className="text-center shadow-xl">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mx-auto" />
                    <Skeleton className="h-12 w-1/2 mx-auto mt-2" />
                </CardHeader>
            </Card>

            <div className="space-y-8">
                <Skeleton className="h-9 w-1/4 mx-auto" />
                <Card className="shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/5" />
                        <Skeleton className="h-4 w-2/5 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex-1 space-y-2 p-1">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function HomePage() {
  const [results, setResults] = useState<OutfitSegmentationAndItemMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [styleProfile, setStyleProfile] = useStyleProfile();
  const { toast } = useToast();

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setResults(null);
  };

  const handleAnalysisSuccess = (data: OutfitSegmentationAndItemMatchingOutput) => {
    setResults(data);
    if (data.updatedStyleProfile) {
        setStyleProfile(data.updatedStyleProfile);
        toast({
            title: "Style Profile Updated!",
            description: "We've updated your style preferences based on this outfit.",
        });
    }
    setIsLoading(false);
  };

  const handleAnalysisError = (error: string) => {
    toast({
      variant: 'destructive',
      title: 'Analysis Failed',
      description: error,
    });
    setIsLoading(false);
  };
  
  const handleReset = () => {
    setResults(null);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {results || isLoading ? (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Analyze Another Outfit
            </Button>
            {isLoading && <LoadingSkeleton />}
            {results && <ResultsDisplay results={results} />}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Discover Your Style
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                    Upload a photo of an outfit, and our AI will find where to buy each piece, identify the style, and refine your personal taste.
                </p>
            </div>
            <ImageUploader 
                onAnalysisStart={handleAnalysisStart}
                onAnalysisSuccess={handleAnalysisSuccess}
                onAnalysisError={handleAnalysisError}
                styleProfile={styleProfile}
            />
        </div>
      )}
    </div>
  );
}
