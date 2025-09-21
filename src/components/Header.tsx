import Link from 'next/link';
import { Shirt, User, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shirt className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline text-lg">
              Outfit Finder
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-1 justify-end">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center">
              <span className="hidden sm:inline">Analyze</span>
              <span className="sm:hidden">Analyze</span>
            </Link>
          </Button>
           <Button variant="ghost" asChild>
            <Link href="/search" className="flex items-center">
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/favorites" className="flex items-center">
              <Heart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/profile" className="flex items-center">
              <User className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}