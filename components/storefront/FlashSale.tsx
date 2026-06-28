'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 10,
  });
  const addNotification = useNotificationStore(state => state.addNotification);
  const notifSent = useRef<Set<string>>(new Set());

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
        title: 'Last Chance! ⏳',
        message: 'Flash sale ends in 10 minutes. Final call on all deals!',
        actionUrl: '/#flash-sale',
      });
    }
  }, [totalMinutes, addNotification]);

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
    <div id="flash-sale" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[2rem] bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white p-6 sm:p-8 shadow-2xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <Flame className="h-8 w-8 text-yellow-300 animate-pulse drop-shadow-md" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight drop-shadow-sm">
              Flash Sale
            </h3>
            <p className="text-sm text-white/90 font-medium drop-shadow-sm">
              Grab deals before they expire! Up to 60% OFF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl tabular-nums shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
              {formatNumber(timeLeft.hours)}
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/90 mt-2">Hours</span>
          </div>
          <span className="font-bold text-2xl -mt-6 text-white/70">:</span>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl tabular-nums shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
              {formatNumber(timeLeft.minutes)}
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/90 mt-2">Mins</span>
          </div>
          <span className="font-bold text-2xl -mt-6 text-white/70">:</span>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl tabular-nums shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] text-yellow-200">
              {formatNumber(timeLeft.seconds)}
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/90 mt-2">Secs</span>
          </div>
        </div>

      </div>
    </div>
  );
}
