'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatKsh } from '@/lib/utils';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const addItem = useCartStore(state => state.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="h-16 w-16 mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h1>
          <p className="text-sm text-gray-500">Save items you love and come back to them later.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden group">
              <Link href={`/product/${item.id}`} className="block aspect-square bg-gray-50 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Heart className="h-10 w-10" />
                  </div>
                )}
              </Link>
              <div className="p-4 space-y-2">
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-gray-600">{item.name}</h3>
                </Link>
                <p className="text-sm font-bold text-gray-900">{formatKsh(item.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addItem({ ...item, quantity: 1 });
                      toast.success('Added to cart');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success('Removed from wishlist');
                    }}
                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}