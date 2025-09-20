'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { handleImageSearch } from '@/lib/actions';
import type { Product } from '@/types';

interface ImageSearchFormProps {
  setResults: (results: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTriggered: (triggered: boolean) => void;
  setUploadedImage: (image: string | null) => void;
}

const ImageSearchForm = ({
  setResults,
  setLoading,
  setError,
  setSearchTriggered,
  setUploadedImage,
}: ImageSearchFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
       if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileChange({ target: fileInputRef.current } as any);
      }
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearPreview = () => {
    setFile(null);
    setPreview(null);
    setUploadedImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !preview) {
      setError('Please select an image first.');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    setResults([]);
    setSearchTriggered(true);

    try {
      const results = await handleImageSearch({ photoDataUri: preview });
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
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex justify-center items-center w-full"
        >
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
            </div>
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-sm mx-auto">
          <Image
            src={preview}
            alt="Image preview"
            width={400}
            height={400}
            className="rounded-lg object-contain w-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button type="submit" disabled={!file || isSubmitting} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Analyzing Outfit...' : 'Find My Style'}
      </Button>
    </form>
  );
};

export default ImageSearchForm;
