'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatKsh } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore();

  const total = getCartTotal();
  const shipping = total >= 5000 ? 0 : 350;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-sm text-gray-500">Looks like you haven&#39;t added anything yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-gray-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatKsh(item.price)}</p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1.5 hover:bg-gray-50 text-gray-500 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1.5 hover:bg-gray-50 text-gray-500 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="text-sm font-bold text-gray-900">{formatKsh(item.price * item.quantity)}</p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{formatKsh(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className="font-medium text-gray-900">
              {shipping === 0 ? <span className="text-emerald-600">Free</span> : formatKsh(shipping)}
            </span>
          </div>
          {total < 5000 && (
            <p className="text-xs text-gray-400">Free shipping on orders over {formatKsh(5000)}</p>
          )}
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">{formatKsh(grandTotal)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors mt-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Proceed to Checkout
          </Link>

          <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-3.5 w-3.5 inline mr-1" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}