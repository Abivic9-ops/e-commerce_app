import React from 'react';
import { getProducts } from '@/app/actions/products';
import { getCategories } from '@/app/actions/categories';
import { ProductsClient } from '@/components/admin/ProductsClient';

// Ensure this route is dynamic so it fetches fresh DB inventory on load
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const initialProducts = await getProducts();
  const initialCategories = await getCategories();

  return (
    <ProductsClient 
      initialProducts={initialProducts} 
      initialCategories={initialCategories} 
    />
  );
}
