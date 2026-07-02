'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface WishlistButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  className?: string;
}

export default function WishlistButton({ product, className = '' }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  return (
    <button
      onClick={() => toggleItem({ id: product._id, name: product.name, price: product.price, image: product.images?.[0] || '' })}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
      />
    </button>
  );
}