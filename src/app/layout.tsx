import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { Playfair_Display, Lato } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});


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
    <html lang="en" className={`${playfairDisplay.variable} ${lato.variable}`}>
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
