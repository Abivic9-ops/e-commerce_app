'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

function DetectiveSVG() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      className="w-40 h-36 sm:w-52 sm:h-44 text-foreground"
      aria-hidden="true"
    >
      {/* Floating question marks */}
      <motion.text
        x="38"
        y="28"
        fontSize="16"
        fontWeight="700"
        fill="currentColor"
        opacity="0.25"
        animate={{ y: [0, -6, 0], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        ?
      </motion.text>
      <motion.text
        x="168"
        y="40"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
        opacity="0.2"
        animate={{ y: [0, -4, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        ?
      </motion.text>
      <motion.text
        x="155"
        y="110"
        fontSize="10"
        fontWeight="700"
        fill="currentColor"
        opacity="0.15"
        animate={{ y: [0, -3, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      >
        ?
      </motion.text>
      <motion.text
        x="42"
        y="100"
        fontSize="10"
        fontWeight="700"
        fill="currentColor"
        opacity="0.15"
        animate={{ y: [0, -3, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        ?
      </motion.text>

      {/* Dotted path the detective is following */}
      <motion.circle
        cx="36"
        cy="160"
        r="2.5"
        fill="currentColor"
        opacity="0.15"
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="56"
        cy="150"
        r="2"
        fill="currentColor"
        opacity="0.12"
        animate={{ opacity: [0.12, 0.35, 0.12] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle
        cx="78"
        cy="142"
        r="2.5"
        fill="currentColor"
        opacity="0.15"
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      />
      <motion.circle
        cx="100"
        cy="136"
        r="2"
        fill="currentColor"
        opacity="0.12"
        animate={{ opacity: [0.12, 0.35, 0.12] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
      />

      {/* Connected line for the path */}
      <path
        d="M36,160 L56,150 L78,142 L100,136"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.12"
      />

      {/* === DETECTIVE CHARACTER === */}

      {/* Shadow on ground */}
      <ellipse cx="108" cy="167" rx="28" ry="4" fill="currentColor" opacity="0.08" />

      {/* Legs */}
      <line x1="98" y1="140" x2="94" y2="165" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="118" y1="140" x2="122" y2="165" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* Trench coat body */}
      <path
        d="M86,65 C86,65 82,120 85,142 L131,142 C134,120 130,65 130,65 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.4"
      />

      {/* Coat lapels */}
      <path d="M96,65 L100,80 L108,65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

      {/* Left arm (behind magnifying glass) */}
      <path
        d="M86,72 C76,82 58,78 52,70"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Right arm */}
      <path
        d="M130,72 C140,82 158,78 164,70"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Magnifying glass frame */}
      <circle cx="52" cy="70" r="18" stroke="currentColor" strokeWidth="3" opacity="0.6" />
      <circle cx="52" cy="70" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />

      {/* Magnifying glass handle */}
      <line x1="65" y1="83" x2="74" y2="92" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />

      {/* Magnifying glass shine */}
      <path
        d="M44,62 C46,58 50,56 54,56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Head */}
      <circle cx="108" cy="50" r="16" fill="currentColor" opacity="0.9" />

      {/* Fedora hat – brim */}
      <path
        d="M86,44 C86,36 130,36 130,44"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Fedora hat – crown */}
      <path
        d="M93,40 L98,22 C98,22 118,22 118,22 L123,40"
        fill="currentColor"
        opacity="0.85"
      />

      {/* Hat band */}
      <line x1="94" y1="38" x2="122" y2="38" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />

      {/* Eyes (curious look) */}
      <motion.ellipse
        cx="102"
        cy="48"
        rx="2"
        ry="2.5"
        className="fill-background"
        animate={{ scaleY: [1, 0.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.ellipse
        cx="114"
        cy="48"
        rx="2"
        ry="2.5"
        className="fill-background"
        animate={{ scaleY: [1, 0.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Eyebrows (raised, confused) */}
      <path d="M98,42 L104,43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M112,43 L118,42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Small smile */}
      <path d="M104,55 C106,57 110,57 112,55" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Glow under magnifying glass (searching effect) */}
      <motion.ellipse
        cx="52"
        cy="70"
        rx="12"
        ry="8"
        fill="currentColor"
        opacity="0.06"
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-radial from-background via-muted/50 to-background px-4 py-12 overflow-hidden">

      {/* Background Accents */}
      <div className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/3 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">

        {/* Detective illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <DetectiveSVG />
        </motion.div>

        {/* 404 label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-[8rem] sm:text-[11rem] font-extrabold leading-none tracking-tighter select-none -mt-2"
        >
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
            4
          </span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            0
          </span>
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
            4
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          className="text-sm font-semibold tracking-widest uppercase text-muted-foreground/60"
        >
          Page Not Found
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
          className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm"
        >
          Looks like this page slipped through the cracks. Even our best detective couldn&apos;t track it down.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full shadow-lg shadow-primary/20">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-full border-border">
              <Search className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </motion.div>

        {/* Decorative separator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
          className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent"
        />

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-semibold">
            ShopEasy
          </span>
          {' '}&mdash; Premium Kenyan E-Commerce
        </motion.p>
      </div>
    </div>
  );
}
