'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Star, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatKES } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/useCartStore';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
}

// Rich product catalog with Jumia/Kilimall variety
const PRODUCTS: Product[] = [
  { id: 'windbreaker-rain-jacket', name: 'Windbreaker Rain Jacket - Waterproof Shell', category: 'Fashion', price: 3500, originalPrice: 5200, image: '/product_jacket.png', rating: 4.6, reviews: 124, stock: 4 },
  { id: 'classic-felt-fedora', name: 'Classic Felt Fedora Hat – Ribbon Band', category: 'Fashion', price: 1800, originalPrice: 2500, image: '/product_hat.png', rating: 4.3, reviews: 78, stock: 9 },
  { id: 'leather-messenger-bag', name: 'Leather Messenger Crossbody Bag', category: 'Bags', price: 4500, originalPrice: 6200, image: '/product_bag.png', rating: 4.8, reviews: 213, stock: 2 },
  { id: 'ultra-cushion-sneakers', name: 'Ultra Cushion Sporty Running Sneakers', category: 'Shoes', price: 5200, originalPrice: 7800, image: '/product_shoes.png', rating: 4.7, reviews: 345, stock: 12 },
  { id: 'shopeasy-phone-12-pro', name: 'ShopEasy Phone 12 Pro – 128GB, Triple Camera', category: 'Electronics', price: 18500, originalPrice: 24000, image: '/product_phone.png', rating: 4.5, reviews: 512, stock: 20, featured: true },
  { id: 'stainless-glass-kettle', name: 'Premium Stainless Steel & Glass Electric Kettle', category: 'Home & Kitchen', price: 2900, originalPrice: 4000, image: '/product_kettle.png', rating: 4.4, reviews: 189, stock: 15 },
  { id: 'windbreaker-yellow', name: 'Bold Yellow Windbreaker – Unisex Street Style', category: 'Fashion', price: 3200, originalPrice: 4500, image: '/product_jacket.png', rating: 4.2, reviews: 56, stock: 8 },
  { id: 'suede-ankle-boots', name: 'Suede Ankle Boots – Kenyan Crafted', category: 'Shoes', price: 6500, originalPrice: 9000, image: '/product_shoes.png', rating: 4.6, reviews: 91, stock: 6 },
  { id: 'wired-earphones-pro', name: 'Pro Bass Wired Earphones – Deep Sound', category: 'Electronics', price: 1200, originalPrice: 1800, image: '/product_phone.png', rating: 4.1, reviews: 430, stock: 50 },
  { id: 'canvas-tote-bag', name: 'Eco Canvas Tote Shopper Bag – Printed', category: 'Bags', price: 850, originalPrice: 1200, image: '/product_bag.png', rating: 4.0, reviews: 67, stock: 35 },
  { id: 'smart-blender', name: 'Smart Multi-Speed Blender – 1.5L Jug', category: 'Home & Kitchen', price: 3800, originalPrice: 5500, image: '/product_kettle.png', rating: 4.5, reviews: 143, stock: 10 },
  { id: 'baseball-cap-navy', name: 'Classic Navy Baseball Cap – Embroidered Logo', category: 'Fashion', price: 950, originalPrice: 1400, image: '/product_hat.png', rating: 4.3, reviews: 98, stock: 22 },
];

const ALL_CATEGORIES = ['All', 'Fashion', 'Electronics', 'Shoes', 'Bags', 'Home & Kitchen'];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviews'];

export default function ProductsPageClient() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(30000);
  const addItem = useCartStore(state => state.addItem);

  // Filter and sort
  const filtered = PRODUCTS
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      return matchSearch && matchCat && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      if (sortBy === 'Most Reviews') return b.reviews - a.reviews;
      return 0; // Newest is default order
    });

  const discount = (p: Product) => p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">All Products</h1>
        <p className="text-sm text-muted-foreground">
          Discover {PRODUCTS.length}+ curated items across fashion, electronics, home goods, and more — all with M-Pesa checkout.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search all products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none bg-background border border-border rounded-xl text-sm font-medium pl-4 pr-9 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background text-foreground hover:bg-secondary'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Max Price Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Max Price</label>
                    <span className="text-sm font-bold text-primary">{formatKES(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={30000}
                    step={500}
                    value={maxPrice}
                    onChange={e => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>KES 500</span>
                    <span>KES 30,000</span>
                  </div>
                </div>

                {/* Min Rating Placeholder */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Showing</label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">{filtered.length}</span> of {PRODUCTS.length} products match your current filters and search query.
                  </p>
                  <button
                    onClick={() => { setSearch(''); setSelectedCategory('All'); setMaxPrice(30000); setSortBy('Newest'); }}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tab Row */}
      <div className="flex gap-2 flex-wrap">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-muted-foreground font-medium">
        Showing <span className="text-foreground font-bold">{filtered.length}</span> results
        {selectedCategory !== 'All' && <> in <span className="text-primary font-bold">{selectedCategory}</span></>}
      </p>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-3">
          <Search className="h-12 w-12 opacity-20" />
          <p className="text-sm">No products match your search. Try adjusting your filters.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="text-xs text-primary hover:underline font-semibold cursor-pointer">
            Clear search
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/product/${product.id}`} className="group block bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square bg-secondary/30 dark:bg-secondary/10 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  {discount(product) > 0 && (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      -{discount(product)}%
                    </span>
                  )}
                  {product.stock <= 5 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      Low Stock
                    </span>
                  )}
                  {product.featured && (
                    <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{product.category}</p>
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-0.5">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-foreground">{formatKES(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-muted-foreground line-through">{formatKES(product.originalPrice)}</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
                      toast.success(`${product.name} added to cart!`);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 mt-1 bg-primary/90 hover:bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
