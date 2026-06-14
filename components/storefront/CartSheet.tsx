'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatKES } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function CartSheet() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();

  // Prevent hydration errors by only rendering the cart contents on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative cursor-pointer">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg border-l border-border bg-card p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground font-extrabold text-xl">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-20 w-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Looks like you haven't added anything to your cart yet.
              </p>
              <SheetTrigger asChild>
                <Button className="mt-4" variant="default" asChild>
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </SheetTrigger>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-secondary/20 rounded-2xl border border-border/50 relative group">
                  <div className="relative h-20 w-20 bg-background rounded-xl overflow-hidden border border-border shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="pr-6">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</h4>
                      <p className="text-sm font-extrabold text-primary mt-1">{formatKES(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="text-lg font-extrabold text-foreground">{formatKES(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <SheetTrigger asChild>
              <Button className="w-full text-base font-semibold py-6 cursor-pointer" size="lg" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
