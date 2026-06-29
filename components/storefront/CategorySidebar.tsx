'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Shirt,
  ShoppingBag,
  Watch,
  Laptop,
  Smartphone,
  Home,
  Footprints,
  Tag,
  TrendingUp,
  Package,
  Grid,
} from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const categories = [
  { name: 'T-Shirts', slug: 't-shirts', icon: Shirt },
  { name: 'Bags', slug: 'bags', icon: ShoppingBag },
  { name: 'Watches', slug: 'watches', icon: Watch },
  { name: 'Electronics', slug: 'electronics', icon: Laptop },
  { name: 'Phones', slug: 'phones', icon: Smartphone },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: Home },
  { name: 'Shoes', slug: 'shoes', icon: Footprints },
  { name: 'Deals', slug: 'deals', icon: Tag },
  { name: 'Trending', slug: 'trending', icon: TrendingUp },
  { name: 'Essentials', slug: 'essentials', icon: Package },
  { name: 'All Categories', slug: '', icon: Grid },
];

export default function CategorySidebar({ selectedCategory, onSelectCategory }: CategorySidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-32 rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground tracking-tight">Categories</h3>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const href = cat.slug ? `/products?category=${cat.slug}` : '/products';
            const isActive = selectedCategory === cat.slug || (!selectedCategory && !cat.slug);

            if (onSelectCategory) {
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50'
                  )}
                >
                  <Icon className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-blue-600' : 'text-muted-foreground'
                  )} />
                  <span>{cat.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={cat.name}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                  pathname === '/products' && isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50'
                )}
              >
                <Icon className={cn(
                  'h-4 w-4 shrink-0',
                  pathname === '/products' && isActive ? 'text-blue-600' : 'text-muted-foreground'
                )} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
