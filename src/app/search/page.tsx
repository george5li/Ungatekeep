
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { searchByDescription } from '@/app/actions';
import { Loader2, Search as SearchIcon, ExternalLink } from 'lucide-react';
import type { DescriptiveOutfitSearchOutput } from '@/ai/flows/descriptive-outfit-search';

const searchSchema = z.object({
  description: z.string().min(10, 'Please enter a more detailed description.'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

function SearchResults({ results }: { results: DescriptiveOutfitSearchOutput }) {
    if (!results || results.length === 0) {
        return (
            <Card className="text-center py-20 px-6">
                <CardHeader>
                    <CardTitle>No Results Found</CardTitle>
                    <CardDescription>The AI couldn't find any matching items. Try a different description.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, index) => (
                <Card key={index} className="group h-full flex flex-col shadow-lg">
                    <CardContent className="flex flex-col items-center justify-between p-4 gap-4 flex-1">
                        <div className="aspect-[4/5] w-full relative overflow-hidden rounded-lg">
                            <Image
                                src={item.imageUrl || 'https://picsum.photos/seed/1/400/500'}
                                alt={item.description}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="fashion clothing"
                            />
                        </div>
                        <p className="text-sm text-center text-muted-foreground flex-grow">{item.description}</p>
                        <Button asChild className="w-full">
                            <Link href={item.link} target="_blank" rel="noopener noreferrer">
                                View Item <ExternalLink className="ml-2" size={16} />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


export default function SearchPage() {
  const [results, setResults] = useState<DescriptiveOutfitSearchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setIsLoading(true);
    setResults(null);
    const response = await searchByDescription(data.description);
    if (response.success) {
      setResults(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-wider">
            Describe Your Dream Outfit
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell our AI what you're looking for, and it will find it for you.
          </p>
        </div>

        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full">
                <Input
                  {...register('description')}
                  placeholder="e.g., 'A vintage-style floral summer dress with puff sleeves'"
                  className="text-lg p-6 w-full"
                  disabled={isLoading}
                />
                {errors.description && <p className="text-destructive text-sm mt-2">{errors.description.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2" /> Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="space-y-4 p-4">
                        <div className="aspect-[4/5] w-full bg-muted rounded-lg" />
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                        <div className="h-10 bg-muted rounded w-full" />
                    </Card>
                ))}
            </div>
        )}

        {results && <SearchResults results={results} />}
      </div>
    </div>
  );
}
