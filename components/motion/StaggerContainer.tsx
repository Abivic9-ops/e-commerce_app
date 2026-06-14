'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  id?: string;
}

export function StaggerContainer({
  children,
  delayChildren = 0,
  staggerChildren = 0.05,
  className = '',
  id,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: shouldReduceMotion ? 0 : delayChildren,
        staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
      },
    },
  };

  return (
    <motion.div
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-20px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
