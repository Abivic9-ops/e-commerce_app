'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  y?: number;
  className?: string;
}

export function FadeIn({
  children,
  duration = 0.3,
  delay = 0,
  y = 15,
  className = '',
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
