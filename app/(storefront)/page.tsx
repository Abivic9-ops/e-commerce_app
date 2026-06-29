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
import { products as storeProducts } from '@/data/products';
import { type Product } from '@/components/storefront/ProductCard';

export const dynamic = 'force-dynamic';

export default async function StorefrontHomePage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  const flashSaleProducts: Product[] = storeProducts
    .filter(p => p.isFlashSale)
    .map(p => ({
      id: p.id,
      _id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviews: p.reviews,
      stockLeft: p.stockLeft,
      image: p.image,
      isFlashSale: p.isFlashSale,
      isLimited: p.isLimited,
    }));

  const recommendedProducts: Product[] = storeProducts
    .map(p => ({
      id: p.id,
      _id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviews: p.reviews,
      stockLeft: p.stockLeft,
      image: p.image,
      isFlashSale: p.isFlashSale,
      isLimited: p.isLimited,
    }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-[#F7F6F3]">

        <FadeIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="hidden md:block w-56 flex-shrink-0">
                <CategorySidebar />
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
            <CategoryStrip />
          </div>
        </FadeIn>

        <FadeIn>
          <FlashSale products={flashSaleProducts} isLoggedIn={isLoggedIn} />
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
            <ProductGrid products={recommendedProducts} isLoggedIn={isLoggedIn} />
          </section>
        </FadeIn>

      </main>

      <Footer />
    </div>
  );
}
