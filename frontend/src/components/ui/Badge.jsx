import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold uppercase rounded tracking-wider border select-none';

  const variants = {
    critical: 'bg-red-950/80 text-red-400 border-red-500/40 shadow-sm shadow-red-950/50',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-950/50',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-950/50',
    info: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40 shadow-sm shadow-cyan-950/50',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60'
  };

  const sizes = {
    sm: 'h-5 px-2 text-[10px] gap-1',
    md: 'h-6 px-2.5 text-[11px] gap-1.5',
    lg: 'h-7 px-3 text-xs gap-2'
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
