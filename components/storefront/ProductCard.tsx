'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import { formatKsh } from '@/lib/utils';
import ProductImageDisplay from './ProductImageDisplay';

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  featured: boolean;
  slug: string;
  description?: string;
  sold?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isLoggedIn?: boolean;
}

export default function ProductCard({ product, onAddToCart, isLoggedIn }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlist();

  const productImage = product.images?.[0] || '';
  const isFlashSale = product.featured;
  const isLimited = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem({ id: product._id, name: product.name, price: product.price, image: productImage, quantity: 1 });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ id: product._id, name: product.name, price: product.price, image: productImage });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md flex flex-col h-full overflow-hidden transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImageDisplay
            name={product.name}
            category={product.category}
            imageUrl={productImage}
            className="group-hover:scale-105 transition-transform duration-500"
          />

          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            </div>
          )}

          {isLimited && (
            <div className="absolute top-2 right-9 z-10">
              <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded animate-pulse">
                Limited
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
              <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3.5 w-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </p>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">
              ({product.reviewsCount})
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-sm font-bold text-gray-900">
              {formatKsh(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatKsh(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-colors ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
            }`}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}