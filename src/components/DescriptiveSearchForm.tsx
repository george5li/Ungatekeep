'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sparkles } from 'lucide-react';
import { handleDescriptiveSearch } from '@/lib/actions';
import type { Product } from '@/types';

interface DescriptiveSearchFormProps {
  setResults: (results: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTriggered: (triggered: boolean) => void;
  setUploadedImage: (image: string | null) => void;
}

const DescriptiveSearchForm = ({
  setResults,
  setLoading,
  setError,
  setSearchTriggered,
  setUploadedImage,
}: DescriptiveSearchFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please describe the style you are looking for.');
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    setResults([]);
    setSearchTriggered(true);
    setUploadedImage(null);

    try {
      const results = await handleDescriptiveSearch({ prompt });
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-6">
      <Textarea
        placeholder="e.g., 'A vintage, 70s-inspired summer dress with floral patterns' or 'Minimalist streetwear with neutral tones'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[120px] text-base"
      />
      <Button type="submit" disabled={isSubmitting || !prompt} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Generating Ideas...' : 'Get Recommendations'}
      </Button>
    </form>
  );
};

export default DescriptiveSearchForm;
