'use client';

import React, { useMemo } from 'react';

interface ProductImageDisplayProps {
  name: string;
  category: string;
  imageUrl?: string;
  className?: string;
}

const CATEGORY_COLORS: Record<string, { gradient: string; accent: string; bg: string }> = {
  'Fashion':       { gradient: 'from-rose-500/20 via-pink-500/10 to-indigo-500/20', accent: '#be185d', bg: '#fff1f2' },
  'Electronics':   { gradient: 'from-blue-500/20 via-cyan-500/10 to-sky-500/20',    accent: '#0369a1', bg: '#f0f9ff' },
  'Shoes':         { gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20', accent: '#b45309', bg: '#fffbeb' },
  'Bags':          { gradient: 'from-emerald-500/20 via-teal-500/10 to-green-500/20', accent: '#047857', bg: '#ecfdf5' },
  'Home & Kitchen':{ gradient: 'from-violet-500/20 via-purple-500/10 to-fuchsia-500/20', accent: '#7c3aed', bg: '#f5f3ff' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || { gradient: 'from-slate-200 via-gray-100 to-zinc-200', accent: '#52525b', bg: '#f8fafc' };
}

export default function ProductImageDisplay({ name, category, imageUrl, className = '' }: ProductImageDisplayProps) {
  const colors = useMemo(() => getCategoryColor(category), [category]);
  const initials = useMemo(() => getInitials(name), [name]);

  if (imageUrl) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <img src={imageUrl} alt={name} className="object-contain w-full h-full" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.bg }}
      className={`w-full h-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={`glow-${name.replace(/\s/g, '')}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#glow-${name.replace(/\s/g, '')})`} />
        <circle cx="35" cy="35" r="28" fill={colors.accent} fillOpacity="0.06" />
        <circle cx="65" cy="65" r="22" fill={colors.accent} fillOpacity="0.04" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
              fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="28"
              fill={colors.accent} fillOpacity="0.12">
          {initials}
        </text>
      </svg>
    </div>
  );
}