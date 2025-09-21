import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Ungatekeep',
  description: 'Find your style, one outfit at a time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
