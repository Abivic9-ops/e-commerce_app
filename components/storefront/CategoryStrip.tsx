'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, ShoppingBag, Watch, Laptop, Tag, TrendingUp, Package, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  slug: string;
}

interface CategoryStripProps {
  categories: Category[];
}

const iconMap: Record<string, React.ElementType> = {
  'Fashion': Shirt,
  'Bags': ShoppingBag,
  'Watches': Watch,
  'Electronics': Laptop,
  'Shoes': Shirt,
  'Home & Kitchen': Shirt,
  'Deals': Tag,
  'Trending': TrendingUp,
  'Essentials': Package,
};

export default function CategoryStrip({ categories }: CategoryStripProps) {
  const displayCats = categories.slice(0, 8);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {displayCats.map((cat, idx) => {
          const Icon = iconMap[cat.name] || Tag;
          return (
            <Link key={cat.name} href={`/products?category=${cat.slug}`} className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="flex flex-col items-center gap-2 group pt-1 cursor-pointer"
                whileHover={{ y: -4 }}
              >
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center shadow-sm border border-border/10 transition-all duration-300 group-hover:shadow-md">
                  <Icon className="h-6 w-6 text-royal transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-semibold text-royal">
                  {cat.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}