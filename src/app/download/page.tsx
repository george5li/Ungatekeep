'use client';

import FileContent from '@/components/FileContent';
import { allFiles } from '@/lib/all-files';
import { Download } from 'lucide-react';

export default function DownloadPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4 flex items-center">
          <Download className="mr-4 h-12 w-12" />
          Download Your Code
        </h1>
        <p className="text-lg text-muted-foreground">
          Copy the content of each file below and save it locally to create
          your own copy of the project.
        </p>
      </div>

      <div className="space-y-8">
        {allFiles.map((file) => (
          <FileContent
            key={file.path}
            filePath={file.path}
            content={file.content}
          />
        ))}
      </div>
    </main>
  );
}
