'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  // Compute transition separately so TypeScript can infer the correct type,
  // instead of creating a union that Framer Motion's strict Variants can't accept.
  const transition: Transition = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 260, damping: 25 };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: {
      opacity: 1,
      y: 0,
      transition,
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
