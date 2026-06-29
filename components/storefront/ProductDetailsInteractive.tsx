'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatKES } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

interface ProductDetailsInteractiveProps {
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  };
}

export function ProductDetailsInteractive({ product }: ProductDetailsInteractiveProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const addNotification = useNotificationStore(state => state.addNotification);

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Only ${product.stock} items left in stock.`);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/product_shoes.png',
      quantity,
    });
    toast.success(`Added ${quantity} x ${product.name} to cart!`);
    addNotification({
      type: 'cart',
      title: 'Added to Cart',
      message: `${quantity} x ${product.name} added to your cart.`,
      actionUrl: '/checkout',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">Select Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
            <button
              onClick={decrementQty}
              aria-label="Decrease quantity"
              className="px-3.5 py-2.5 hover:bg-secondary text-foreground transition-colors cursor-pointer border-r border-border"
              disabled={product.stock === 0}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-bold text-sm text-foreground select-none">
              {product.stock === 0 ? 0 : quantity}
            </span>
            <button
              onClick={incrementQty}
              aria-label="Increase quantity"
              className="px-3.5 py-2.5 hover:bg-secondary text-foreground transition-colors cursor-pointer border-l border-border"
              disabled={product.stock === 0}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <span className="text-xs text-muted-foreground">
            {product.stock > 0 
              ? `${product.stock} items available in Nairobi warehouse` 
              : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          size="lg"
          className="flex-1 gap-2 font-bold cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Add to Cart</span>
        </Button>
      </div>

      {/* Trust Badges (Jumia/Kilimall style) */}
      <div className="grid grid-cols-3 gap-3 border-t border-border/80 pt-6 mt-2 text-center">
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-secondary/20 border border-border/40">
          <Truck className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Fast Delivery</span>
          <span className="text-[9px] text-muted-foreground">Within 24-48 Hours</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-secondary/20 border border-border/40">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Secure Checkout</span>
          <span className="text-[9px] text-muted-foreground">M-Pesa Verification</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-secondary/20 border border-border/40">
          <RefreshCw className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-bold text-foreground">Easy Returns</span>
          <span className="text-[9px] text-muted-foreground">7 Days Exchange Policy</span>
        </div>
      </div>

    </div>
  );
}
