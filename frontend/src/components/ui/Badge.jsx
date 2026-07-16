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
    online:    'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/25',
    offline:   'bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/25',
    active:    'bg-[#4F46E5]/15 text-[#818CF8] border-[#4F46E5]/25',
    waiting:   'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/25',
    completed: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/25',
    cancelled: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/25',
    coding:    'bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/25',
    hr:        'bg-[#4F46E5]/15 text-[#818CF8] border-[#4F46E5]/25',
    candidate: 'bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/25',
  };

  const dotColors = {
    online: 'bg-[#10B981]',
    offline: 'bg-[#64748B]',
    active: 'bg-[#818CF8]',
    waiting: 'bg-[#FBBF24]',
    completed: 'bg-[#10B981]',
    cancelled: 'bg-[#F87171]',
    coding: 'bg-[#22D3EE]',
    hr: 'bg-[#818CF8]',
    candidate: 'bg-[#22D3EE]',
  };

  const shouldPulse = dot && (variant === 'online' || variant === 'active' || variant === 'coding');

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${variants[variant] || variants.active} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {shouldPulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || 'bg-[#818CF8]'}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant] || 'bg-[#818CF8]'}`} />
        </span>
      )}
      {children}
    </span>
  );
}
