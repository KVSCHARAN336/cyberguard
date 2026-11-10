import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Input({
  className = '',
  icon: Icon,
  error,
  label,
  ...props
}) {
  return (
    <div className="space-y-1.5 font-mono text-xs w-full">
      {label && (
        <label className="block text-slate-400 font-semibold tracking-wide uppercase text-[10px]">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          className={twMerge(
            clsx(
              'h-10 w-full bg-slate-950/90 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-xs outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500',
              Icon ? 'pl-10 pr-3.5' : 'px-3.5',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-rose-400 text-[10px] font-mono">{error}</p>
      )}
    </div>
  );
}
