import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Card({
  children,
  className = '',
  header,
  footer,
  hoverable = true,
  ...props
}) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all duration-200 flex flex-col justify-between',
          hoverable && 'hover:border-slate-700 hover:shadow-2xl',
          className
        )
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-800/80 pb-4 mb-4 flex items-center justify-between">
          {header}
        </div>
      )}

      <div className="flex-1 space-y-4">
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
