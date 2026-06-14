import React from 'react';
import { Package, Search, MapPin, Calendar, Clock } from 'lucide-react';

export const metadata = {
  title: 'Track Your Order - ShopEasy',
  description: 'Enter your order number to track your delivery status.',
};

export default function OrdersPage() {
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

      {/* Tracking Form (Visual Only for Phase 3) */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto">
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="orderId" className="text-sm font-semibold text-foreground">
              Order ID
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="orderId"
                name="orderId"
                type="text"
                placeholder="e.g. ORD-12345678"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-foreground">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="07XX XXX XXX"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <button
            type="button" // Change to submit later
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Track Package
          </button>
        </form>
      </div>

      {/* Placeholder for order status (to be dynamic later) */}
      <div className="max-w-xl mx-auto p-6 bg-secondary/30 rounded-2xl border border-border/50 space-y-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Example Tracking State
        </h3>
        
        <div className="relative pl-6 border-l-2 border-primary space-y-8">
          <div className="relative">
            <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <p className="font-semibold text-foreground">Order Placed</p>
            <p className="text-sm text-muted-foreground">Today, 10:45 AM</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <p className="font-semibold text-foreground">Processing</p>
            <p className="text-sm text-muted-foreground">Today, 11:30 AM</p>
          </div>
          <div className="relative opacity-50">
            <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-border ring-4 ring-background" />
            <p className="font-semibold text-foreground">Out for Delivery</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="relative opacity-50">
            <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-border ring-4 ring-background" />
            <p className="font-semibold text-foreground">Delivered</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
