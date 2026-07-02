'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Star, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatKsh } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { toast } from 'sonner';
import ProductImageDisplay from './ProductImageDisplay';

interface ProductItem {
  id: string;
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  featured?: boolean;
}

const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

interface ProductsPageClientProps {
  initialProducts: any[];
  initialCategories: any[];
}

export default function ProductsPageClient({ initialProducts, initialCategories }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(30000);
  const addItem = useCartStore(state => state.addItem);

  const products: ProductItem[] = initialProducts.map((p: any) => ({
    id: p.slug,
    _id: p._id,
    name: p.name,
    category: typeof p.category === 'object' && p.category ? p.category.name : 'Unassigned',
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images?.length ? p.images[0] : '',
    rating: p.rating || 4.5,
    reviewsCount: p.reviewsCount || 0,
    stock: p.stock,
    featured: p.featured,
  }));

  const allCategories = ['All', ...initialCategories.map((c: any) => c.name)];

  useEffect(() => {
    if (categoryParam) {
      const matched = initialCategories.find((c: any) => c.slug === categoryParam);
      setSelectedCategory(matched ? matched.name : 'All');
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam, initialCategories]);

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
      return 0;
    });

  const discount = (p: ProductItem) => p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-sm text-gray-500">
          {products.length} items across {initialCategories.length} categories
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg text-sm pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
            showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Max Price</label>
                    <span className="text-sm font-semibold text-gray-900">{formatKsh(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={30000}
                    step={500}
                    value={maxPrice}
                    onChange={e => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-gray-900"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatKsh(500)}</span>
                    <span>{formatKsh(30000)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Results</label>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{filtered.length}</span> of {products.length} products match
                  </p>
                  <button
                    onClick={() => { setSearch(''); setSelectedCategory('All'); setMaxPrice(30000); setSortBy('Newest'); }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-900 underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-1.5 flex-wrap">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{filtered.length}</span> results
        {selectedCategory !== 'All' && <> in <span className="font-semibold text-gray-700">{selectedCategory}</span></>}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
          <Search className="h-10 w-10 opacity-30" />
          <p className="text-sm">No products match your search.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="text-xs text-gray-600 hover:text-gray-900 underline font-medium cursor-pointer">
            Clear search
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/product/${product.id}`} className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <ProductImageDisplay
                    name={product.name}
                    category={product.category}
                    imageUrl={product.image}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount(product) > 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{discount(product)}%
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{product.category}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({product.reviewsCount})</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-gray-900">{formatKsh(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">{formatKsh(product.originalPrice)}</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.stock === 0) return;
                      addItem({ id: product._id, name: product.name, price: product.price, image: product.image || '', quantity: 1 });
                      toast.success('Added to cart');
                    }}
                    disabled={product.stock === 0}
                    className={`w-full flex items-center justify-center gap-1.5 mt-1 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer ${
                      product.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
                    }`}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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