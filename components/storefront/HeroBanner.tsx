'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function HeroBanner() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleShopNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      router.push('/products');
    } else {
      router.push('/login?redirectTo=/products');
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-[2rem] bg-card dark:bg-card border border-border/80 shadow-2xl shadow-primary/5 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 lg:p-16 gap-8 min-h-[380px] sm:min-h-[460px] group">
        
        {/* Background Gradients for depth */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-royal/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/5 pointer-events-none" />

        {/* Hero Text Content */}
        <div className="flex-1 max-w-xl space-y-6 text-center md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal px-4 py-1.5 bg-royal/10 border border-royal/20 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-royal animate-pulse" />
            New Arrivals Available
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]"
          >
            Discover True <br />
            <span className="text-gradient bg-gradient-to-r from-royal via-blue-400 to-royal bg-[200%_auto] animate-[gradient_4s_linear_infinite]">
              Elegance.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0 font-medium"
          >
            Elevate your everyday style with our hand-picked collection. Quality materials, modern cuts, and fast delivery.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-2"
          >
            <Button 
              size="lg" 
              className="rounded-full font-bold px-8 h-12 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer text-sm tracking-wide" 
              onClick={handleShopNow}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Explore Collection
            </Button>
            <Link href="/#flash-sale" className="text-sm font-bold text-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5">
              View Flash Sales
            </Link>
          </motion.div>
        </div>

        {/* Hero Image Collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex-1 w-full max-w-[480px] aspect-square relative z-10 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
          <Image
            src="/hero_fashion.png"
            alt="Premium curated clothing selection"
            fill
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-w-768px) 100vw, 480px"
          />
        </motion.div>
      </div>
    </section>
  );
}
