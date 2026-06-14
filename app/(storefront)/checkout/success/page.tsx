import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';

export const metadata = {
  title: 'Payment Successful - ShopEasy',
};

interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || 'ORD-UNKNOWN';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <CheckCircle2 className="h-24 w-24 text-emerald-500 relative z-10" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Thank you for shopping with ShopEasy. Your payment via M-Pesa was successful and your order is now being processed.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 inline-block min-w-[300px]">
        <p className="text-sm font-semibold text-muted-foreground mb-1">Order Reference ID</p>
        <p className="text-2xl font-black text-primary">{orderId}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border/50">
        <Link 
          href="/orders"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
        >
          <Package className="h-4 w-4" />
          Track Order
        </Link>
        <Link 
          href="/products"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
