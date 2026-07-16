import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component.
 *
 * Props:
 *   variant  – 'primary' | 'secondary' | 'danger' | 'ghost'
 *   size     – 'sm' | 'md' | 'lg'
 *   loading  – boolean
 *   icon     – Lucide icon component (rendered left of children)
 *   iconRight– Lucide icon component (rendered right of children)
 *   className– extra Tailwind classes
 *   ...props – all native button attributes
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  icon: Icon, 
  iconRight: IconRight,
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-[14px]';
  
  const variants = {
    primary: 'text-white border-transparent focus:ring-indigo-500 hover:-translate-y-0.5',
    secondary: 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 focus:ring-slate-500',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 focus:ring-rose-500',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 focus:ring-slate-500',
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))',
    boxShadow: '0 4px 14px rgba(91, 108, 255, 0.25)'
  } : {};

  const hoverClasses = variant === 'primary' 
    ? 'hover:shadow-[0_0_15px_rgba(91,108,255,0.4)] hover:brightness-110' 
    : '';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${hoverClasses} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      style={primaryStyle}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 14 : 18} />
      ) : Icon ? (
        <Icon className="mr-2" size={size === 'sm' ? 14 : 18} />
      ) : null}
      {children}
      {IconRight && !loading && (
        <IconRight className="ml-2" size={size === 'sm' ? 14 : 18} />
      )}
    </button>
  );
};

export default Button;
