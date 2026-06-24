'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, ShoppingBag, Watch, Grid, Laptop, Heart, Sparkles, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'T-Shirts', icon: Shirt, color: 'text-blue-500 bg-blue-500/10', href: '/products?category=fashion' },
  { name: 'Bags', icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-500/10', href: '/products?category=bags' },
  { name: 'Watches', icon: Watch, color: 'text-amber-500 bg-amber-500/10', href: '/products?category=fashion' },
  { name: 'Electronics', icon: Laptop, color: 'text-indigo-500 bg-indigo-500/10', href: '/products?category=electronics' },
  { name: 'Deals', icon: Tag, color: 'text-rose-500 bg-rose-500/10', href: '/products' },
  { name: 'Trending', icon: Sparkles, color: 'text-purple-500 bg-purple-500/10', href: '/products' },
  { name: 'Essentials', icon: Heart, color: 'text-pink-500 bg-pink-500/10', href: '/products' },
  { name: 'All Categories', icon: Grid, color: 'text-slate-600 bg-slate-500/10 dark:text-slate-300', href: '/categories' },
];

export default function CategoryRow() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Browse Categories
          </h3>
          <Link href="/categories" className="text-xs font-semibold text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>

        {/* Scrollable Container */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className={`h-16 w-16 sm:h-18 sm:w-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border border-border/20 group-hover:scale-105 group-hover:shadow-md ${cat.color}`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {cat.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

