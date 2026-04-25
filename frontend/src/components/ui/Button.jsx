import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component.
 *
 * Props:
 *   variant  – 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
 *   size     – 'sm' | 'md' | 'lg'
 *   loading  – boolean
 *   icon     – Lucide icon component (rendered left of children)
 *   iconRight– Lucide icon component (rendered right of children)
 *   className– extra Tailwind classes
 *   ...rest  – all native button attributes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/20',
    secondary:
      'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 focus:ring-gray-600',
    danger:
      'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-500/20',
    ghost:
      'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-200 focus:ring-gray-600',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 shadow-lg shadow-emerald-500/20',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-base px-6 py-2.5 h-11',
  };

  const iconSizes = { sm: 14, md: 16, lg: 18 };
  const iconSize = iconSizes[size];

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : Icon ? (
        <Icon size={iconSize} />
      ) : null}
      {children}
      {!loading && IconRight && <IconRight size={iconSize} />}
    </button>
  );
}
