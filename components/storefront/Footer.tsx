import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/30 transition-colors duration-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              ShopEasy
            </span>
            <p className="text-sm text-muted-foreground leading-6">
              Empowering local merchants and delivering quality merchandise directly to your doorstep. Seamless checkout via M-Pesa.
            </p>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                M-PESA Integrated
              </span>
              <span className="text-xs text-muted-foreground">
                KES (Ksh) Supported
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#flash-sale" className="hover:text-foreground transition-colors">
                  Flash Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Office</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-6">
              Moi Avenue, Nairobi, Kenya<br />
              Email: support@shopeasy.co.ke<br />
              Phone: +254 700 000 000
            </p>
          </div>

        </div>
        
        {/* Footer Bottom */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} ShopEasy. All rights reserved. Made in Kenya.
          </p>
          <p className="text-sm font-serif italic text-muted-foreground/80 tracking-wide">
            "Shop Beyond Boundaries"
          </p>
        </div>
      </div>
    </footer>
  );
}
