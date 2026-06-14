import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Categories - ShopEasy',
  description: 'Browse products by category on ShopEasy.',
};

const CATEGORIES = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trending styles and classic wardrobe essentials.',
    image: '/product_jacket.png',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets, phones, and accessories.',
    image: '/product_phone.png',
    bgClass: 'bg-zinc-100 dark:bg-zinc-800/50',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    description: 'Footwear for every occasion, from sneakers to boots.',
    image: '/product_shoes.png',
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    id: 'bags',
    name: 'Bags',
    description: 'Premium leather bags, backpacks, and totes.',
    image: '/product_bag.png',
    bgClass: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Appliances and essentials for a modern home.',
    image: '/product_kettle.png',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
];

export default function CategoriesPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/products`}
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
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-contain drop-shadow-xl"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
