"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { analyzeOutfit } from '@/app/actions';
import type { OutfitSegmentationAndItemMatchingOutput } from '@/ai/flows/outfit-segmentation-and-item-matching';

type ImageUploaderProps = {
  onAnalysisStart: () => void;
  onAnalysisSuccess: (results: OutfitSegmentationAndItemMatchingOutput) => void;
  onAnalysisError: (error: string) => void;
  styleProfile: string;
};

export function ImageUploader({ onAnalysisStart, onAnalysisSuccess, onAnalysisError, styleProfile }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsLoading(true);
    onAnalysisStart();
    const result = await analyzeOutfit(preview, styleProfile);
    if (result.success) {
      onAnalysisSuccess(result.data);
    } else {
      onAnalysisError(result.error);
    }
    setIsLoading(false);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  return (
    <Card onDragEnter={handleDrag} className="w-full max-w-2xl mx-auto shadow-lg bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
            {!preview ? (
                <label
                    htmlFor="dropzone-file"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors",
                        dragActive ? "border-primary bg-accent/20" : "border-border"
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                    </div>
                    <input
                        ref={inputRef}
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </label>
            ) : (
                <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-md">
                    <Image
                        src={preview}
                        alt="Outfit preview"
                        width={600}
                        height={800}
                        className="object-contain w-full h-auto max-h-[70vh]"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full z-10"
                        onClick={clearImage}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear image</span>
                    </Button>
                </div>
            )}
            
            {dragActive && <div className="absolute inset-0 z-10" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}

            <Button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                size="lg"
                className="w-full font-bold text-lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Analyzing...
                    </>
                ) : "Analyze Outfit"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
