'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: 'Discover True Elegance.',
    subtitle: 'Elevate your everyday style with our hand-picked collection.',
    cta: 'Explore Collection',
    href: '/products',
  },
  {
    title: 'Smart Deals, Smart Life.',
    subtitle: "Cutting-edge electronics at prices you'll love.",
    cta: 'Shop Electronics',
    href: '/products?category=electronics',
  },
  {
    title: 'Fashion That Speaks.',
    subtitle: 'Trendy looks curated for the modern Kenyan.',
    cta: 'View Fashion',
    href: '/products?category=fashion',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="relative rounded-2xl bg-white dark:bg-card border border-border/60 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-6 sm:p-8 lg:p-10 gap-6 min-h-[340px]">
          {/* Background decorative blob */}
          <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Text Content */}
          <div className="flex-1 z-10 text-center md:text-left">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy dark:text-white leading-[1.15] mb-4">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto md:mx-0 mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href}
                  className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#2563EB]/90 hover:shadow-md transition-all active:scale-[0.97]"
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image */}
          <div className="flex-1 w-full max-w-[320px] aspect-square relative z-10 flex items-center justify-center">
            <Image
              src="/hero_fashion.png"
              alt="ShopEasy collection"
              fill
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_12px_24px_rgba(255,255,255,0.04)]"
              priority
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 dark:bg-card/80 border border-border/40 shadow-sm flex items-center justify-center text-navy dark:text-white hover:bg-white dark:hover:bg-card transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 dark:bg-card/80 border border-border/40 shadow-sm flex items-center justify-center text-navy dark:text-white hover:bg-white dark:hover:bg-card transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-[#2563EB]'
                  : 'w-2 bg-navy/20 dark:bg-white/20 hover:bg-navy/40 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
