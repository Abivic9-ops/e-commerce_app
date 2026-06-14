'use client';

import React from 'react';
import ProductCard, { type Product } from './ProductCard';
import { StaggerContainer } from '@/components/motion/StaggerContainer';
import { StaggerItem } from '@/components/motion/StaggerItem';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export default function ProductGrid({
  products,
  onAddToCart,
  className = '',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
        <p className="text-sm">No products found matching your description.</p>
      </div>
    );
  }

  return (
    <StaggerContainer
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
