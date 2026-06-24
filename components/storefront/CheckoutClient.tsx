'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatKES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Truck, Lock, ArrowLeft, Loader2, Phone, Tag, Check, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getOrderById } from '@/app/actions/orders';
import { validateCoupon } from '@/app/actions/coupons';

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
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
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Basic Kenyan phone validation (07xx / 01xx / 254...)
    const phoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    const match = formData.phone.match(phoneRegex);
    if (!match) {
      toast.error('Please enter a valid Safaricom M-Pesa number.');
      return;
    }
    const formattedPhone = `254${match[1]}`;

    setIsProcessing(true);
    toast.info('Initiating M-Pesa STK Push...');

    try {
      // Map cart items for DB Order representation
      const orderItems = items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Initiate STK Push and Order creation
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: total,
          items: orderItems,
          customerDetails: {
            fullName: formData.fullName,
            phone: formattedPhone,
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
      
      const toastId = toast.loading('Check your phone to enter M-Pesa PIN...', { duration: 60000 });
      
      const orderId = data.orderId;
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds total polling

      // Poll order confirmation state dynamically from DB
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const updatedOrder = await getOrderById(orderId);
          if (updatedOrder) {
            if (updatedOrder.paymentStatus === 'paid') {
              clearInterval(pollInterval);
              toast.dismiss(toastId);
              toast.success('Payment verified successfully!');
              setIsProcessing(false);
              clearCart();
              router.push(`/checkout/success?orderId=${orderId}`);
            } else if (updatedOrder.paymentStatus === 'failed') {
              clearInterval(pollInterval);
              toast.dismiss(toastId);
              toast.error('M-Pesa payment failed or was cancelled.');
              setIsProcessing(false);
            }
          }
        } catch (pollErr) {
          console.error('Error polling order:', pollErr);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          toast.dismiss(toastId);
          toast.warning('Payment verification taking longer than expected. Redirecting to receipt page...');
          setIsProcessing(false);
          clearCart();
          router.push(`/checkout/success?orderId=${orderId}`);
        }
      }, 2000);

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
            <p className="text-muted-foreground">Please enter your delivery and M-Pesa payment details.</p>
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
                <Phone className="h-5 w-5 text-emerald-500" />
                M-Pesa Payment
              </h2>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="text-sm text-emerald-800 dark:text-emerald-300">
                  <p className="font-bold mb-1">Secure STK Push</p>
                  <p>Enter your Safaricom number. You will receive a prompt on your phone to enter your M-Pesa PIN.</p>
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <label className="text-sm font-semibold">M-Pesa Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground select-none">
                    +254
                  </div>
                  <Input 
                    type="tel" 
                    placeholder="7XX XXX XXX" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required 
                    className="pl-14 bg-secondary/30 font-medium text-lg"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isProcessing}
              className="w-full sm:w-auto px-12 py-6 text-lg font-bold shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Awaiting PIN...
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
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive transition-colors">
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
              100% Secure Checkout powered by M-Pesa
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
