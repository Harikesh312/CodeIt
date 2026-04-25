import React from 'react';

/**
 * Status badge component.
 *
 * Props:
 *   variant – 'online' | 'offline' | 'active' | 'waiting' | 'completed' | 'cancelled' | 'coding'
 *   dot     – boolean (show pulsing dot)
 *   className
 */
export default function Badge({ children, variant = 'active', dot = false, className = '' }) {
  const variants = {
    online:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    offline:   'bg-gray-500/15 text-gray-400 border-gray-600/30',
    active:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
    waiting:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
    coding:    'bg-purple-500/15 text-purple-400 border-purple-500/30',
    hr:        'bg-blue-500/15 text-blue-400 border-blue-500/30',
    candidate: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  };

  const dotColors = {
    online: 'bg-emerald-400',
    offline: 'bg-gray-500',
    active: 'bg-blue-400',
    waiting: 'bg-amber-400',
    completed: 'bg-emerald-400',
    cancelled: 'bg-red-400',
    coding: 'bg-purple-400',
    hr: 'bg-blue-400',
    candidate: 'bg-violet-400',
  };

  const shouldPulse = dot && (variant === 'online' || variant === 'active' || variant === 'coding');

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${variants[variant] || variants.active} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {shouldPulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || 'bg-blue-400'}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant] || 'bg-blue-400'}`} />
        </span>
      )}
      {children}
    </span>
  );
}
