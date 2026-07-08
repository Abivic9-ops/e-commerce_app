import React from 'react';
import Header from '@/components/storefront/Header';
import CategorySidebar from '@/components/storefront/CategorySidebar';
import HeroCarousel from '@/components/storefront/HeroCarousel';
import PromoCards from '@/components/storefront/PromoCards';
import CategoryStrip from '@/components/storefront/CategoryStrip';
import FlashSale from '@/components/storefront/FlashSale';
import ProductGrid from '@/components/storefront/ProductGrid';
import Footer from '@/components/storefront/Footer';
import { FadeIn } from '@/components/motion/FadeIn';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getProducts } from '@/app/actions/products';
import { getCategories } from '@/app/actions/categories';
import { type Product } from '@/components/storefront/ProductCard';

export const dynamic = 'force-dynamic';

function getTimeFromDiff(diff: number) {
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default async function StorefrontHomePage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  const flashSaleEndTime = Date.now() + 2 * 3600 * 1000 + 45 * 60 * 1000 + 10 * 1000;
  const flashSaleInitialTimeLeft = getTimeFromDiff(Math.max(0, flashSaleEndTime - Date.now()));

  interface RawProductDoc {
    _id: string;
    name: string;
    category: { _id: string; name: string } | string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    stock: number;
    images: string[];
    featured: boolean;
    slug: string;
    description?: string;
    sold?: number;
  }

  const [allProducts, allCategories] = await Promise.all([
    getProducts({ limit: 50 }),
    getCategories(),
  ]);

  const products = allProducts as RawProductDoc[];

  const mapToProduct = (p: RawProductDoc): Product => ({
    _id: p._id,
    name: p.name,
    category: typeof p.category === 'object' && p.category ? p.category.name : 'Unassigned',
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    stock: p.stock,
    images: p.images?.length ? p.images : [],
    featured: p.featured,
    slug: p.slug,
    description: p.description,
    sold: p.sold,
  });

  const flashSaleProducts: Product[] = products
    .filter(p => p.featured)
    .map(mapToProduct);

  const recommendedProducts: Product[] = products.map(mapToProduct);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-[#F7F6F3]">

        <FadeIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="hidden md:block w-56 flex-shrink-0">
                <CategorySidebar categories={allCategories} />
              </div>
              <div className="flex-1 min-w-0">
                <HeroCarousel />
              </div>
              <div className="hidden md:block w-72 flex-shrink-0">
                <PromoCards />
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryStrip categories={allCategories} />
          </div>
        </FadeIn>

        <FadeIn>
          <FlashSale products={flashSaleProducts} isLoggedIn={isLoggedIn} endTimestamp={flashSaleEndTime} initialTimeLeft={flashSaleInitialTimeLeft} />
        </FadeIn>

        <FadeIn>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Recommended for you
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Personalized picks based on your interests
              </p>
            </div>
            <ProductGrid products={recommendedProducts} />
          </section>
        </FadeIn>

      </main>

      <Footer />
    </div>
  );
}
