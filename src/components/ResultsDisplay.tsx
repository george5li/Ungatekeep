
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ExternalLink, Shirt, ShoppingBag, Lightbulb, Heart, Wand2, Loader2, Camera } from 'lucide-react';
import type { OutfitSegmentationAndItemMatchingOutput } from '@/ai/flows/outfit-segmentation-and-item-matching';
import { useFavorites, FavoriteItem } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { generateOutfitImage } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

type ResultsDisplayProps = {
  results: OutfitSegmentationAndItemMatchingOutput;
};


function AiPhotoshoot({ style, pieces }: { style: string; pieces: string[] }) {
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateImage = async () => {
        setIsLoading(true);
        setGeneratedImage(null);
        const response = await generateOutfitImage(style, pieces);
        if (response.success) {
            setGeneratedImage(response.data.imageUrl);
        } else {
            toast({
                variant: 'destructive',
                title: 'Image Generation Failed',
                description: response.error,
            });
        }
        setIsLoading(false);
    };

    return (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2 tracking-wider">
                    <Wand2 className="text-accent" />
                    AI Photoshoot
                </CardTitle>
                <CardDescription>
                    Generate a unique, AI-powered image of an outfit based on your recommendations.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                {isLoading ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Skeleton className="aspect-[9/16] w-full max-w-sm rounded-lg" />
                        <p className="flex items-center text-muted-foreground"><Loader2 className="mr-2 animate-spin" /> Generating your image... this can take a moment.</p>
                    </div>
                ) : generatedImage ? (
                    <div className="aspect-[9/16] w-full max-w-sm relative overflow-hidden rounded-lg">
                        <Image
                            src={generatedImage}
                            alt="AI generated outfit"
                            fill
                            className="object-cover"
                            data-ai-hint="fashion model"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-8 w-full">
                        <Camera className="w-12 h-12" />
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
                <Button onClick={handleGenerateImage} disabled={isLoading} size="lg" className="w-full max-w-sm">
                    {isLoading ? "Creating Magic..." : (generatedImage ? "Regenerate Image" : "Generate Image")}
                </Button>
            </CardContent>
        </Card>
    );
}


export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { identifiedStyle, segmentedItems, recommendedPieces } = results;
  const { addFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddFavorite = (item: FavoriteItem) => {
    addFavorite(item);
    toast({
        title: "Added to Favorites!",
        description: "You can view your saved items on the Favorites page.",
    });
  }

  return (
    <div className="space-y-12">
      <Card className="text-center shadow-xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardDescription className="text-lg">Identified Style</CardDescription>
          <CardTitle className="text-5xl font-headline text-primary tracking-wider">{identifiedStyle}</CardTitle>
        </CardHeader>
      </Card>
      
      <div className="space-y-8">
        <h2 className="text-3xl font-headline text-center flex items-center justify-center gap-3 tracking-wider">
            <Shirt className="w-8 h-8 text-accent" />
            Your Outfit's Pieces
        </h2>
        {segmentedItems?.map((item, index) => (
          <Card key={index} className="overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="capitalize text-2xl font-headline tracking-wider">{item.itemType}</CardTitle>
              <CardDescription>Similar items found for you to shop</CardDescription>
            </CardHeader>
            <CardContent>
              {item.matchingItems && item.matchingItems.length > 0 ? (
                <Carousel opts={{ align: "start", loop: item.matchingItems.length > 1 }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {item.matchingItems.map((match, matchIndex) => (
                      <CarouselItem key={matchIndex} className="md:basis-1/2 lg:basis-1/3 pl-4">
                        <div className="p-1 h-full">
                          <Card className="group h-full flex flex-col">
                            <CardContent className="flex flex-col items-center justify-between p-4 gap-4 flex-1">
                                <div className="aspect-[4/5] w-full relative overflow-hidden rounded-lg">
                                    <Image
                                        src={match.imageUrl || 'https://picsum.photos/seed/1/400/500'}
                                        alt={match.description}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint="fashion clothing"
                                    />
                                </div>
                              <p className="text-sm text-center text-muted-foreground flex-grow">{match.description}</p>
                              <div className="w-full space-y-2 mt-auto">
                                <Button asChild className="w-full">
                                    <Link href={match.link} target="_blank" rel="noopener noreferrer">
                                    View Item <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleAddFavorite(match)}
                                    disabled={isFavorite(match.link)}
                                >
                                    <Heart className="mr-2 h-4 w-4" />
                                    {isFavorite(match.link) ? 'Saved' : 'Save'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              ) : (
                <p className="text-muted-foreground text-center py-8">No matching items found for this piece.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {recommendedPieces && recommendedPieces.length > 0 && (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2 tracking-wider">
                <Lightbulb className="text-accent" />
                Style Recommendations
            </CardTitle>
            <CardDescription>
              Complete your look with these AI-suggested pieces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {recommendedPieces.map((piece, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted/50 py-2 px-4 rounded-full">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <span className="font-medium">{piece}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {identifiedStyle && recommendedPieces && recommendedPieces.length > 0 && (
        <AiPhotoshoot style={identifiedStyle} pieces={recommendedPieces} />
      )}
    </div>
  );
}
