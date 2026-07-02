import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Share2, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { getProductBySlug } from '@/app/actions/products';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ProductDetailsInteractive } from '@/components/storefront/ProductDetailsInteractive';
import ProductReviews from '@/components/storefront/ProductReviews';
import WishlistButton from '@/components/storefront/WishlistButton';
import ProductImageDisplay from '@/components/storefront/ProductImageDisplay';
import { formatKsh } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorefrontProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
            <p className="text-sm text-gray-500">This product may have been removed or is no longer available.</p>
            <Link href="/" className="inline-flex items-center justify-center px-5 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
              Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : 'Unassigned';
  const mainImage = product.images?.[0] || '';
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <WishlistButton product={product} />
              <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300 cursor-pointer transition-all">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden aspect-square max-h-[500px] relative shadow-sm">
              <ProductImageDisplay
                name={product.name}
                category={categoryName}
                imageUrl={mainImage}
                className="w-full h-full"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-medium text-gray-600 bg-white/90 px-2 py-0.5 rounded">
                  {categoryName}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {product.name}
                  </h1>

                  <p className="text-xs text-gray-400">{categoryName}</p>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.rating || '4.5'} ({product.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="border-t border-b border-gray-100 py-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatKsh(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatKsh(product.originalPrice)}
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    product.stock > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <ProductDetailsInteractive product={JSON.parse(JSON.stringify(product))} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <ProductReviews productId={product._id} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}