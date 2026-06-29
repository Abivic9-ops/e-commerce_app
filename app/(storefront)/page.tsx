import React from 'react';
import { getProducts } from '@/app/actions/products';
import { getCategories } from '@/app/actions/categories';
import { getCurrentUser } from '@/lib/supabase/auth';
import Header from '@/components/storefront/Header';
import HeroBanner from '@/components/storefront/HeroBanner';
import CategoryRow from '@/components/storefront/CategoryRow';
import FlashSale from '@/components/storefront/FlashSale';
import ProductGrid from '@/components/storefront/ProductGrid';
import Footer from '@/components/storefront/Footer';
import { FadeIn } from '@/components/motion/FadeIn';
import { type Product } from '@/components/storefront/ProductCard';

export const dynamic = 'force-dynamic';

// 1. Flash Sale Items (Fallback for visual layout check before inventory creation)
const fallbackFlashSaleProducts: Product[] = [
  {
    id: 'windbreaker-rain-jacket',
    title: 'Windbreaker Rain Jacket - Waterproof Shell',
    category: 'Fashion',
    price: 3500,
    image: '/product_jacket.png',
    rating: 4.6,
    numReviews: 24,
    stock: 4,
    maxStock: 10,
  },
  {
    id: 'classic-felt-fedora',
    title: 'Classic Felt Fedora Hat with Ribbon Band',
    category: 'Fashion',
    price: 1800,
    image: '/product_hat.png',
    rating: 4.3,
    numReviews: 14,
    stock: 3,
    maxStock: 12,
  },
  {
    id: 'leather-messenger-bag',
    title: 'Leather Messenger Crossbody Shoulder Bag',
    category: 'Bags',
    price: 4500,
    image: '/product_bag.png',
    rating: 4.8,
    numReviews: 32,
    stock: 2,
    maxStock: 8,
  },
  {
    id: 'ultra-cushion-sneakers',
    title: 'Ultra Cushion Sporty Running Sneakers',
    category: 'Shoes',
    price: 5200,
    image: '/product_shoes.png',
    rating: 4.7,
    numReviews: 45,
    stock: 5,
    maxStock: 15,
  },
];

// 2. Recommended Items (Fallback)
const fallbackRecommendedProducts: Product[] = [
  {
    id: 'shopeasy-phone-12-pro',
    title: 'ShopEasy Phone 12 Pro - 128GB, Triple Camera',
    category: 'Electronics',
    price: 18500,
    image: '/product_phone.png',
    rating: 4.5,
    numReviews: 112,
    stock: 12,
    maxStock: 20,
  },
  {
    id: 'stainless-glass-kettle',
    title: 'Premium Stainless Steel & Glass Electric Kettle',
    category: 'Electronics',
    price: 2900,
    image: '/product_kettle.png',
    rating: 4.4,
    numReviews: 89,
    stock: 15,
    maxStock: 25,
  },
  {
    id: 'windbreaker-rain-jacket',
    title: 'Windbreaker Rain Jacket - Waterproof Shell',
    category: 'Fashion',
    price: 3500,
    image: '/product_jacket.png',
    rating: 4.6,
    numReviews: 24,
    stock: 4,
    maxStock: 10,
  },
  {
    id: 'ultra-cushion-sneakers',
    title: 'Ultra Cushion Sporty Running Sneakers',
    category: 'Shoes',
    price: 5200,
    image: '/product_shoes.png',
    rating: 4.7,
    numReviews: 45,
    stock: 5,
    maxStock: 15,
  },
  {
    id: 'leather-messenger-bag',
    title: 'Leather Messenger Crossbody Shoulder Bag',
    category: 'Bags',
    price: 4500,
    image: '/product_bag.png',
    rating: 4.8,
    numReviews: 32,
    stock: 2,
    maxStock: 8,
  },
  {
    id: 'classic-felt-fedora',
    title: 'Classic Felt Fedora Hat with Ribbon Band',
    category: 'Fashion',
    price: 1800,
    image: '/product_hat.png',
    rating: 4.3,
    numReviews: 14,
    stock: 3,
    maxStock: 12,
  },
];

export default async function StorefrontHomePage() {
  const dbProducts = await getProducts();
  const dbCategories = await getCategories();
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  // Map db products to UI interfaces
  const mappedProducts: Product[] = dbProducts.map((p: any) => ({
    id: p.slug,
    _id: p._id,
    title: p.name,
    category: typeof p.category === 'object' ? p.category.name : 'Unassigned',
    price: p.price,
    image: p.images[0] || '/product_shoes.png',
    rating: p.rating || 4.5,
    numReviews: p.reviewsCount || 10,
    stock: p.stock,
    maxStock: p.stock + p.sold + 10,
  }));

  // Resolve visual items
  const flashSaleProducts = mappedProducts.length > 0 ? mappedProducts.slice(0, 4) : fallbackFlashSaleProducts;
  const recommendedProducts = mappedProducts.length > 0 ? mappedProducts : fallbackRecommendedProducts;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-grow pb-16 bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-200">
        
        {/* 1. Hero Promo Banner */}
        <HeroBanner />

        {/* 2. Scrollable Category List */}
        <CategoryRow />

        {/* 3. Flash Sale countdown & Grid */}
        <div className="space-y-4">
          <FlashSale />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGrid
              products={flashSaleProducts}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>

        {/* 4. Recommendation Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Today's For You!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Personalized deals based on active inventory
              </p>
            </div>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              See More Recommendations &rarr;
            </span>
          </div>

          <ProductGrid
            products={recommendedProducts}
            isLoggedIn={isLoggedIn}
          />
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
