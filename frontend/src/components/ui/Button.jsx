import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50 border border-cyan-400/30 focus:ring-cyan-500',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500',
    outline: 'bg-transparent border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 focus:ring-cyan-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 border border-rose-400/30 focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-400 hover:text-white focus:ring-slate-500',
    icon: 'p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-xs gap-2',
    lg: 'h-12 px-6 text-sm gap-2.5'
  };

  return (
    <button
      disabled={disabled}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
