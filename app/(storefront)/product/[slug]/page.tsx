import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Heart, Share2, Layers } from 'lucide-react';

import { getProductBySlug } from '@/app/actions/products';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ProductDetailsInteractive } from '@/components/storefront/ProductDetailsInteractive';
import { Badge } from '@/components/ui/badge';
import { formatKES } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StorefrontProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  // Fallback if the product does not exist
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8 bg-background">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">Product Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The item you are searching for might have been removed or updated. Please check the URL or return to shopping.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all text-sm"
            >
              Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Unassigned';
  const mainImage = product.images[0] || '/product_shoes.png';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[#fafafa] dark:bg-zinc-950 py-8 md:py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground group transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Catalog
            </Link>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer hover:shadow-xs transition-all">
                <Heart className="h-4.5 w-4.5" />
              </button>
              <button className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer hover:shadow-xs transition-all">
                <Share2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Left: Product Images Display */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 flex items-center justify-center aspect-square md:max-h-[500px] relative overflow-hidden shadow-xs">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 hover:scale-102"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent font-bold">
                  {categoryName}
                </Badge>
              </div>
            </div>

            {/* Right: Product Details Form */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title and Ratings */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'text-slate-300 dark:text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {product.rating || '4.5'} Rating ({product.reviewsCount || 12} Verified Reviews)
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="border-y border-border/80 py-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-foreground">
                    {formatKES(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatKES(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    In Stock
                  </span>
                </div>

                {/* Description Short */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Product Description</h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Quantity Select and Cart Trigger */}
              <div className="border-t border-border/60 pt-6">
                <ProductDetailsInteractive product={JSON.parse(JSON.stringify(product))} />
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
