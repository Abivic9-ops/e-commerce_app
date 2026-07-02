import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/app/actions/categories';

export const metadata = {
  title: 'Categories - ShopEasy',
  description: 'Browse products by category on ShopEasy.',
};

export const dynamic = 'force-dynamic';

const getCategoryUIProps = (slug: string) => {
  switch (slug) {
    case 'fashion':
      return {
        description: 'Trending styles and classic wardrobe essentials.',
        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      };
    case 'electronics':
      return {
        description: 'Latest gadgets, phones, and accessories.',
        bgClass: 'bg-zinc-100 dark:bg-zinc-800/50',
      };
    case 'shoes':
      return {
        description: 'Footwear for every occasion, from sneakers to boots.',
        bgClass: 'bg-orange-50 dark:bg-orange-900/20',
      };
    case 'bags':
      return {
        description: 'Premium leather bags, backpacks, and totes.',
        bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      };
    case 'home-kitchen':
    case 'home-and-kitchen':
    case 'home-&-kitchen':
      return {
        description: 'Appliances and essentials for a modern home.',
        bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
      };
    default:
      return {
        description: 'Explore our handpicked quality collection.',
        bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
      };
  }
};

export default async function CategoriesPage() {
  const dbCategories = await getCategories();

  const categories = dbCategories.map((c: any) => {
    const ui = getCategoryUIProps(c.slug);
    return {
      id: c.slug,
      name: c.name,
      description: ui.description,
      image: c.image || '',
      bgClass: ui.bgClass,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Shop by Category
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find exactly what you're looking for. Browse our curated collections across various departments.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-3xl">
          <p className="text-sm">No categories registered in inventory yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60 ${category.bgClass}`} />
              
              <div className="relative z-10 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="mt-8 flex items-center text-sm font-semibold text-primary">
                  Explore Category
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 h-48 w-48 transition-transform duration-500 group-hover:scale-110">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

