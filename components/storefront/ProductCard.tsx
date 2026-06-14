import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatKES } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/useCartStore';
import { toast } from 'sonner';

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  numReviews: number;
  stock: number;
  maxStock: number; // For progress bar visualization
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stockPercentage = (product.stock / product.maxStock) * 100;
  const addItem = useCartStore(state => state.addItem);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group bg-card text-card-foreground border border-border/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg flex flex-col h-full transition-all duration-300"
    >
      {/* Product Image Wrapper */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full bg-secondary/30 dark:bg-secondary/10 flex items-center justify-center p-4 overflow-hidden block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-none font-bold text-[10px] uppercase tracking-wider text-slate-800 dark:text-zinc-200">
            {product.category}
          </Badge>
        </div>

        {/* Quick discount or deals indicator */}
        {product.stock <= 5 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="destructive" className="animate-pulse text-[10px] uppercase font-extrabold tracking-wide">
              Limited Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300 dark:text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">
              ({product.numReviews})
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h4>
          </Link>
        </div>

        {/* Pricing & Stock progress (Jumia/Kilimall style) */}
        <div className="space-y-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-foreground">
              {formatKES(product.price)}
            </span>
            <span className="text-[10px] text-muted-foreground line-through">
              {formatKES(product.price * 1.3)}
            </span>
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
              <span>Stock: {product.stock} items left</span>
              <span>{Math.round(stockPercentage)}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  product.stock <= 5 ? 'bg-rose-500' : 'bg-primary'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>

          {/* Add to Cart CTA */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                addItem({ id: product.id, name: product.title, price: product.price, image: product.image, quantity: 1 });
                toast.success(`${product.title} added to cart!`);
              }
            }}
            className="w-full mt-2 gap-2 font-semibold text-xs rounded-xl shadow-xs"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
