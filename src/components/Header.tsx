'use client';

import Link from 'next/link';
import { Download, Heart, Shirt } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const Header = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Search',
      icon: Shirt,
      active: pathname === '/',
    },
    {
      href: '/favorites',
      label: 'Favorites',
      icon: Heart,
      active: pathname === '/favorites',
    },
     {
      href: '/download',
      label: 'Download',
      icon: Download,
      active: pathname === '/download',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shirt className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">StyleFind AI</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-2 justify-end">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'text-muted-foreground',
                      item.active && 'text-primary'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>
    </header>
  );
};

export default Header;
