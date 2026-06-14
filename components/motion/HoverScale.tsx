'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  tapScale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.02,
  tapScale = 0.98,
  className = '',
}: HoverScaleProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
