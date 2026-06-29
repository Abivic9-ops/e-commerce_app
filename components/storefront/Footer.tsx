import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F1B2D]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-white">
              ShopEasy
            </span>
            <p className="text-sm text-gray-400 leading-6">
              Connecting you with the best of Kenya&apos;s local marketplace — authentic goods, fair prices, delivered to your door.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                M-PESA Integrated
              </span>
              <span className="text-xs text-gray-400">
                KES (Ksh) Supported
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#flash-sale" className="hover:text-white transition-colors">
                  Flash Sales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Office</h3>
            <div className="mt-4 text-sm text-gray-400 leading-6 space-y-1">
              <p>Moi Avenue, Nairobi, Kenya</p>
              <p>
                Email:{' '}
                <a href="mailto:support@shopeasy.co.ke" className="hover:text-white transition-colors">
                  support@shopeasy.co.ke
                </a>
              </p>
              <p>
                Phone:{' '}
                <a href="tel:+254700000000" className="hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; 2026 ShopEasy. All rights reserved. Made in Kenya.
          </p>
          <p className="text-sm font-serif italic text-gray-400/80 tracking-wide">
            Shop Beyond Boundaries
          </p>
        </div>
      </div>
    </footer>
  );
}
