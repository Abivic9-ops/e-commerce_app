'use client';

import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 10,
  });

  // Simple countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div id="flash-sale" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6 shadow-lg shadow-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none translate-x-12 -translate-y-12" />
        
        {/* Flash Sale Left Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Flame className="h-6 w-6 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              Flash Sale
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Grab deals before they expire! Up to 60% OFF.
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-lg tabular-nums shadow-inner">
              {formatNumber(timeLeft.hours)}
            </div>
            <span className="text-[10px] uppercase font-bold text-white/80 mt-1">Hrs</span>
          </div>
          <span className="font-bold text-lg -mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-lg tabular-nums shadow-inner">
              {formatNumber(timeLeft.minutes)}
            </div>
            <span className="text-[10px] uppercase font-bold text-white/80 mt-1">Min</span>
          </div>
          <span className="font-bold text-lg -mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-lg tabular-nums shadow-inner text-yellow-200">
              {formatNumber(timeLeft.seconds)}
            </div>
            <span className="text-[10px] uppercase font-bold text-white/80 mt-1">Sec</span>
          </div>
        </div>

      </div>
    </div>
  );
}
