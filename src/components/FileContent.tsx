'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileContentProps {
  filePath: string;
  content: string;
}

export default function FileContent({ filePath, content }: FileContentProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setHasCopied(true);
    toast({
      title: 'Copied to clipboard!',
      description: `${filePath} has been copied.`,
    });
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-mono">{filePath}</CardTitle>
        <Button variant="ghost" size="icon" onClick={copyToClipboard}>
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-code">
          <code>{content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
