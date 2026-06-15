'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-radial from-background via-muted/50 to-background px-4 py-12 overflow-hidden">

      {/* Background Accents */}
      <div className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/3 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-[9rem] sm:text-[12rem] font-extrabold leading-none tracking-tighter select-none"
        >
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
            4
          </span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            0
          </span>
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
            4
          </span>
        </motion.div>

        {/* Error title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed"
        >
          This page seems to have wandered off. It might have been moved, deleted, or never existed.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-full border-border">
              <Search className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </motion.div>

        {/* Decorative separator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
          className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent"
        />

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-semibold">
            ShopEasy
          </span>
          {' '}&mdash; Premium Kenyan E-Commerce
        </motion.p>
      </div>
    </div>
  );
}
