'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import { formatKsh } from '@/lib/utils';

export interface Product {
  id: string;
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  stockLeft: number;
  image: string;
  isFlashSale: boolean;
  isLimited: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isLoggedIn?: boolean;
}

export default function ProductCard({ product, onAddToCart, isLoggedIn }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlist();

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const maxStock = 50;
  const stockPercentage = Math.min((product.stockLeft / maxStock) * 100, 100);
  const isOutOfStock = product.stockLeft === 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md flex flex-col h-full overflow-hidden transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shadow-sm ${product.isFlashSale ? 'bg-royal text-white' : 'bg-white/90 text-foreground'}`}>
            {product.category}
          </span>
        </div>

        {product.stockLeft <= 5 && product.stockLeft > 0 && (
          <div className="absolute top-3 right-12 z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-600 text-white px-2 py-1 rounded-full animate-pulse shadow-lg">
              LIMITED STOCK
            </span>
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-xs font-extrabold bg-emerald-500 text-white px-2 py-1 rounded-md shadow-lg">
              -{discountPercent}%
            </span>
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-2">
          {product.name}
        </h4>

        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-foreground">
            {formatKsh(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatKsh(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="space-y-1 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground">
              Stock: {product.stockLeft} items left
            </span>
          </div>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                product.stockLeft <= 5 ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-2 flex items-center justify-center gap-2 font-bold text-xs rounded-xl h-10 transition-all ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-md'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
