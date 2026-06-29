'use client';

import React from 'react';
import ProductCard, { type Product } from './ProductCard';
import { StaggerContainer } from '@/components/motion/StaggerContainer';
import { StaggerItem } from '@/components/motion/StaggerItem';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  isLoggedIn?: boolean;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  isLoggedIn = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground text-lg">No products found</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-primary hover:underline cursor-pointer"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} isLoggedIn={isLoggedIn} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
