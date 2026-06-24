import React, { Suspense } from 'react';
import ProductsPageClient from '@/components/storefront/ProductsPageClient';
import { getProducts } from '@/app/actions/products';
import { getCategories } from '@/app/actions/categories';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'All Products - ShopEasy',
  description: 'Browse our full catalog of fashion, electronics, bags, shoes, and home goods.',
};

export const dynamic = 'force-dynamic';

async function ProductsPageContent() {
  const initialProducts = await getProducts();
  const initialCategories = await getCategories();

  return (
    <ProductsPageClient 
      initialProducts={initialProducts} 
      initialCategories={initialCategories} 
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading catalog inventory...</p>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

