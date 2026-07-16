import React from 'react';

/**
 * Loading spinner component.
 *
 * Props:
 *   size    – 'sm' | 'md' | 'lg' | 'xl'
 *   text    – optional label below spinner
 *   fullScreen – boolean (center in full viewport)
 *   className
 */
export default function LoadingSpinner({ size = 'md', text, fullScreen = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-[#283548] border-t-[#4F46E5] animate-spin`}
      />
      {text && <p className="text-[#94A3B8] text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
