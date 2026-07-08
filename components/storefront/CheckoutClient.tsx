'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { formatKES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Truck, Lock, ArrowLeft, Loader2, Tag, Check, X, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { validateCoupon } from '@/app/actions/coupons';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        currency?: string;
        metadata?: Record<string, unknown>;
        onClose?: () => void;
        callback?: (response: { reference: string; trans?: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="js.paystack.co"]')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack SDK'));
    document.head.appendChild(script);
  });
}

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Nairobi',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountAmount: number; discountType: string; discountValue: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items, router]);

  if (!isMounted || items.length === 0) return null;

  const subtotal = getCartTotal();
  const shipping = 350;
  const discount = couponApplied?.discountAmount ?? 0;
  const total = subtotal + shipping - discount;

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const result = await validateCoupon(couponCode.trim(), subtotal);
    setCouponLoading(false);
    if (result.success) {
      setCouponApplied(result as any);
      toast.success(`Coupon "${result.code}" applied! You save ${formatKES(result.discountAmount!)}`);
    } else {
      toast.error(result.error || 'Invalid coupon');
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          items: orderItems,
          customerDetails: {
            fullName: formData.fullName,
            phone: formData.phone || '',
            address: formData.address,
            city: formData.city,
          },
          subtotal,
          shippingFee: shipping,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Payment initiation failed');

      await loadPaystackScript();

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Paystack public key is not configured');
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: Math.round(total * 100),
        ref: data.reference,
        currency: 'KES',
        metadata: {
          orderId: data.orderId,
          customer_name: formData.fullName,
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info('Payment window closed. You can try again.');
        },
        callback: function (response: { reference: string }) {
          fetch(`/api/paystack/verify?reference=${response.reference}`).catch((err) =>
            console.error('Verify call failed (order may still process via webhook):', err)
          );
          addNotification({
            type: 'order',
            title: 'Order Confirmed!',
            message: `Your order #${data.orderId.slice(-8)} has been placed successfully. Track it in your orders.`,
            actionUrl: '/orders',
          });
          clearCart();
          setIsProcessing(false);
          router.push(`/checkout/success?orderId=${data.orderId}`);
        },
      });

      handler.openIframe();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to initiate payment. Try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground">Enter your details to complete your purchase.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Delivery Details */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Delivery Details
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required 
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required 
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold">Phone Number (optional)</label>
                  <Input 
                    type="tel"
                    placeholder="+254 7XX XXX XXX" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold">Delivery Address (Building, Street)</label>
                  <Input 
                    placeholder="e.g. KICC, Harambee Avenue" 
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    required 
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">City / Region</label>
                  <select 
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-secondary/30 border border-border rounded-xl text-sm font-medium px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Paystack Payment
              </h2>
              
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-bold mb-1">Secured by Paystack</p>
                  <p>Pay with your card, mobile money, or bank transfer. Your payment details are handled securely by Paystack.</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  After clicking "Pay", a secure payment popup will open. Complete the payment there.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isProcessing}
              className="w-full sm:w-auto px-12 py-6 text-lg font-bold shadow-xl cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening Paystack...
                </>
              ) : (
                `Pay ${formatKES(total)}`
              )}
            </Button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-secondary/20 border border-border rounded-3xl p-6 sm:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 bg-background rounded-xl border border-border overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-sm font-extrabold text-foreground mt-1">
                      {formatKES(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/80 pt-4 space-y-3">
              {/* Coupon Input */}
              {!couponApplied ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-sm font-mono uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-xl border border-border disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    <span className="font-mono font-bold">{couponApplied.code}</span>
                    <span className="text-xs">applied!</span>
                  </div>
                  <button onClick={removeCoupon} aria-label="Remove coupon" className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatKES(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping (Nairobi)</span>
                <span className="font-semibold">{formatKES(shipping)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm text-emerald-500">
                  <span className="font-medium">Discount ({couponApplied.code})</span>
                  <span className="font-bold">-{formatKES(couponApplied.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-border">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-black text-primary">{formatKES(total)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              100% Secure Checkout powered by Paystack
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
