'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Zap, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard, { type Product } from './ProductCard';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

interface FlashSaleProps {
  products: Product[];
  isLoggedIn?: boolean;
  endTimestamp?: number;
  initialTimeLeft?: { hours: number; minutes: number; seconds: number };
}

export default function FlashSale({ products, isLoggedIn = false, endTimestamp, initialTimeLeft }: FlashSaleProps) {
  const addNotification = useNotificationStore(state => state.addNotification);
  const notifSent = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [timeLeft, setTimeLeft] = useState(
    initialTimeLeft ?? { hours: 2, minutes: 45, seconds: 10 }
  );

  const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;

  useEffect(() => {
    if (!notifSent.current.has('flash_active')) {
      notifSent.current.add('flash_active');
      addNotification({
        type: 'flash_sale',
        title: 'Flash Sale is LIVE!',
        message: 'Up to 60% OFF on selected items. Grab deals before they expire!',
        actionUrl: '/#flash-sale',
      });
    }
  }, [addNotification]);

  useEffect(() => {
    if (totalMinutes <= 30 && totalMinutes > 29 && !notifSent.current.has('flash_30min')) {
      notifSent.current.add('flash_30min');
      addNotification({
        type: 'flash_sale',
        title: 'Flash Sale Ending Soon!',
        message: 'Only 30 minutes left! Don\'t miss out on these incredible deals.',
        actionUrl: '/#flash-sale',
      });
    }
    if (totalMinutes <= 10 && totalMinutes > 9 && !notifSent.current.has('flash_10min')) {
      notifSent.current.add('flash_10min');
      addNotification({
        type: 'flash_sale',
        title: 'Last Chance!',
        message: 'Flash sale ends in 10 minutes. Final call on all deals!',
        actionUrl: '/#flash-sale',
      });
    }
  }, [totalMinutes, addNotification]);

  useEffect(() => {
    if (endTimestamp && initialTimeLeft) {
      const realDiff = Math.max(0, endTimestamp - Date.now());
      const realTimeLeft = {
        hours: Math.floor(realDiff / 3600000),
        minutes: Math.floor((realDiff % 3600000) / 60000),
        seconds: Math.floor((realDiff % 60000) / 1000),
      };
      if (
        realTimeLeft.hours !== initialTimeLeft.hours ||
        realTimeLeft.minutes !== initialTimeLeft.minutes ||
        realTimeLeft.seconds !== initialTimeLeft.seconds
      ) {
        setTimeLeft(realTimeLeft);
      }
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTimestamp, initialTimeLeft]);

  useEffect(() => {
    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [timeLeft]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div id="flash-sale" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Jumia-style Flash Sale Banner */}
        <div className="bg-gradient-to-r from-royal to-blue-800 rounded-t-2xl px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Zap className="h-6 w-6 text-yellow-300 drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gradient bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-[200%_auto] animate-[gradient_4s_linear_infinite] drop-shadow-sm">
                FLASH SALE
              </h2>
              <p className="text-sm text-blue-200 font-medium">
                Up to 60% OFF — Limited time only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-blue-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/15 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl tabular-nums text-white shadow-inner">
                  {formatNumber(timeLeft.hours)}
                </div>
                <span className="text-[9px] tracking-widest uppercase font-bold text-blue-200 mt-1">Hrs</span>
              </div>
              <span className="font-bold text-xl text-white/60 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/15 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl tabular-nums text-white shadow-inner">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <span className="text-[9px] tracking-widest uppercase font-bold text-blue-200 mt-1">Min</span>
              </div>
              <span className="font-bold text-xl text-white/60 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/15 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl tabular-nums text-white shadow-inner">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <span className="text-[9px] tracking-widest uppercase font-bold text-blue-200 mt-1">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-card border-x border-b border-border/60 rounded-b-2xl p-4 sm:p-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No flash sale products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <ProductCard product={product} isLoggedIn={isLoggedIn} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
