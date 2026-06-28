import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatKES } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/useCartStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
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
  isLoggedIn?: boolean;
}

export default function ProductCard({ product, onAddToCart, isLoggedIn }: ProductCardProps) {
  const router = useRouter();
  const stockPercentage = (product.stock / product.maxStock) * 100;
  const addItem = useCartStore(state => state.addItem);
  const addNotification = useNotificationStore(state => state.addNotification);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-card text-card-foreground border border-border/60 rounded-[1.25rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] flex flex-col h-full transition-all duration-300"
    >
      {/* Product Image Wrapper */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full bg-secondary/20 dark:bg-zinc-900/50 flex items-center justify-center p-6 overflow-hidden block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="glass-effect font-bold text-[10px] uppercase tracking-widest text-foreground/90">
            {product.category}
          </Badge>
        </div>

        {/* Quick discount or deals indicator */}
        {product.stock <= 5 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="destructive" className="animate-pulse text-[10px] uppercase font-extrabold tracking-widest shadow-lg shadow-destructive/20">
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
              if (!isLoggedIn) {
                router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
                return;
              }
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                addItem({ id: product.id, name: product.title, price: product.price, image: product.image, quantity: 1 });
                toast.success(`${product.title} added to cart!`);
                addNotification({
                  type: 'cart',
                  title: 'Added to Cart',
                  message: `${product.title} has been added to your cart.`,
                  actionUrl: '/checkout',
                });
              }
            }}
            className="w-full mt-3 gap-2 font-bold text-xs rounded-xl shadow-xs hover:shadow-primary/20 transition-all h-10"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
