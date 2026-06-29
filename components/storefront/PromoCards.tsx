'use client';

import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

const promos = [
  {
    icon: Truck,
    title: 'Fast & Free Delivery',
    description:
      'Free delivery on orders over Ksh 5,000. Same-day delivery within Nairobi.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure M-PESA Payment',
    description:
      '100% secure checkout via M-Pesa STK Push. Your money is protected.',
  },
];

export default function PromoCards() {
  return (
    <div className="flex flex-col gap-4">
      {promos.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-xl border border-border/60 bg-white dark:bg-card p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal/10 dark:bg-primary/10">
              <Icon className="h-6 w-6 text-royal dark:text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-navy dark:text-white">
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
