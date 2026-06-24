'use client';

import React, { useState, useTransition } from 'react';
import { Package, Search, Clock, CheckCircle2, Truck, MapPin, XCircle, Loader2, CreditCard } from 'lucide-react';
import { getOrderById } from '@/app/actions/orders';
import { formatKES } from '@/lib/utils';
import Image from 'next/image';

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: CreditCard },
  { key: 'shipped', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder = ['placed', 'processing', 'shipped', 'delivered'];

function getStepStatus(stepKey: string, currentStatus: string) {
  const stepIdx = statusOrder.indexOf(stepKey);
  const currentIdx = statusOrder.indexOf(currentStatus);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'current';
  return 'pending';
}

export default function OrdersPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID.');
      return;
    }
    setError('');
    setOrder(null);

    startTransition(async () => {
      const found = await getOrderById(orderId.trim());
      if (!found) {
        setError('No order found with that ID. Please double-check and try again.');
        return;
      }
      // Optionally validate phone if provided
      if (phone.trim()) {
        const phoneDigits = phone.replace(/\D/g, '');
        const orderPhone = found.customerDetails?.phone?.replace(/\D/g, '') ?? '';
        if (!orderPhone.includes(phoneDigits) && !phoneDigits.includes(orderPhone)) {
          setError('The phone number does not match this order.');
          return;
        }
      }
      setOrder(found);
    });
  }

  const paymentBadge = order?.paymentStatus === 'paid'
    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
    : order?.paymentStatus === 'failed'
    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
    : 'bg-amber-500/10 text-amber-500 border-amber-500/30';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Track Your Order
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your Order ID below to check the real-time status of your delivery.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="orderId" className="text-sm font-semibold text-foreground">
              Order ID <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="orderId"
                name="orderId"
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-12345678"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-foreground">
              Phone Number <span className="text-muted-foreground font-normal">(optional, for verification)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</>
            ) : (
              <><Search className="h-4 w-4" /> Track Package</>
            )}
          </button>
        </form>
      </div>

      {/* Order Result */}
      {order && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Order Header Card */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Order ID</p>
                <h2 className="text-xl font-extrabold text-foreground">{order.orderId}</h2>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${paymentBadge}`}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Customer</p>
                <p className="font-semibold text-foreground">{order.customerDetails?.fullName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Phone</p>
                <p className="font-semibold text-foreground">{order.customerDetails?.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Delivery Address</p>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {order.customerDetails?.address}, {order.customerDetails?.city}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Order Total</p>
                <p className="font-extrabold text-primary">{formatKES(order.total)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Placed On</p>
                <p className="font-semibold text-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" /> Delivery Progress
            </h3>
            <div className="relative pl-6 border-l-2 border-border space-y-8">
              {statusSteps.map(({ key, label, icon: Icon }) => {
                const stepStatus = getStepStatus(key, order.deliveryStatus);
                return (
                  <div key={key} className={`relative transition-opacity ${stepStatus === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                    <span className={`absolute -left-[35px] top-0.5 h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-background ${
                      stepStatus === 'done' ? 'bg-emerald-500' : stepStatus === 'current' ? 'bg-primary' : 'bg-border'
                    }`}>
                      {stepStatus === 'done' && <CheckCircle2 className="h-3 w-3 text-white" />}
                      {stepStatus === 'current' && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </span>
                    <p className={`font-semibold text-sm ${stepStatus === 'current' ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stepStatus === 'current' ? 'In progress...' : stepStatus === 'done' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          {order.items?.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-foreground text-base">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-2xl border border-border/50">
                    <div className="relative h-14 w-14 bg-background rounded-xl overflow-hidden border border-border shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-primary whitespace-nowrap">{formatKES(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Shipping</span>
                <span className="text-sm font-semibold">{formatKES(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-extrabold text-primary text-lg">{formatKES(order.total)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
