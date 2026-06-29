'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Star, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatKES } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/useCartStore';
import { toast } from 'sonner';

interface Product {
  id: string;
  _id: string;
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

const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviews'];

interface ProductsPageClientProps {
  initialProducts: any[];
  initialCategories: any[];
}

export default function ProductsPageClient({ initialProducts, initialCategories }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category'); // reads category slug

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(30000);
  const addItem = useCartStore(state => state.addItem);

  // Map db products to UI interfaces
  const products: Product[] = initialProducts.map((p: any) => ({
    id: p.slug,
    _id: p._id,
    name: p.name,
    category: typeof p.category === 'object' ? p.category.name : 'Unassigned',
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images[0] || '/product_shoes.png',
    rating: p.rating || 4.5,
    reviews: p.reviewsCount || 10,
    stock: p.stock,
    featured: p.featured,
  }));

  const allCategories = ['All', ...initialCategories.map((c: any) => c.name)];

  // Sync selectedCategory state with URL category query parameter
  useEffect(() => {
    if (categoryParam) {
      const matched = initialCategories.find((c: any) => c.slug === categoryParam);
      if (matched) {
        setSelectedCategory(matched.name);
      } else {
        setSelectedCategory('All');
      }
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam, initialCategories]);

  // Filter and sort
  const filtered = products
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
      return 0; // default (Newest)
    });

  const discount = (p: Product) => p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">All Products</h1>
        <p className="text-sm text-muted-foreground">
          Discover {products.length}+ curated items across fashion, electronics, home goods, and more — all with M-Pesa checkout.
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
                    <span className="font-bold text-foreground">{filtered.length}</span> of {products.length} products match your current filters and search query.
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
        {allCategories.map(cat => (
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
                      addItem({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
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
