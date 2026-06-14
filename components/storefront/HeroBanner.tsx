'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl bg-[#f3f4f6] dark:bg-zinc-900 border border-border/50 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 lg:p-16 gap-8 min-h-[360px] sm:min-h-[440px]">
        
        {/* Background Gradients for depth */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Text Content */}
        <div className="flex-1 max-w-lg space-y-6 text-center md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full"
          >
            Today's Exclusive Deals
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight"
          >
            Limited Time Offer!<br />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Up to 50% OFF!
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            Elevate your lifestyle with our curated collection of outfits and accessories. Hand-picked quality, made affordable, delivered fast.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <Link href="/products" id="hero-cta-btn">
              <Button size="lg" className="rounded-full font-semibold px-8 hover:shadow-lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/#flash-sale" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              View Flash Sales &rarr;
            </Link>
          </motion.div>
        </div>

        {/* Hero Image Collage */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }}
          className="flex-1 w-full max-w-[420px] aspect-[4/3] relative z-10 flex items-center justify-center"
        >
          <Image
            src="/hero_fashion.png"
            alt="Premium curated clothing selection"
            fill
            className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]"
            priority
            sizes="(max-w-768px) 100vw, 420px"
          />
        </motion.div>
      </div>
    </section>
  );
}
