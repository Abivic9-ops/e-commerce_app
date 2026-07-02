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

interface Category {
  name: string;
  slug: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  'Fashion': Shirt,
  'Bags': ShoppingBag,
  'Watches': Watch,
  'Electronics': Laptop,
  'Phones': Smartphone,
  'Home & Kitchen': Home,
  'Shoes': Footprints,
  'Deals': Tag,
  'Trending': TrendingUp,
  'Essentials': Package,
  'All Categories': Grid,
};

export default function CategorySidebar({ categories, selectedCategory, onSelectCategory }: CategorySidebarProps) {
  const pathname = usePathname();

  const allCategories = [{ name: 'All Categories', slug: '' }, ...categories];

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-32 rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground tracking-tight">Categories</h3>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] py-1">
          {allCategories.map((cat) => {
            const Icon = iconMap[cat.name] || Tag;
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