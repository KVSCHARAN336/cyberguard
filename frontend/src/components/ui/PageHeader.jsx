import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({
  badge = 'GOVERNMENT SUITE',
  title,
  subtitle,
  breadcrumb = ['Dashboard', 'Module'],
  actions
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-400">
            <span className="text-cyan-400 font-bold uppercase">{badge}</span>
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className={idx === breadcrumb.length - 1 ? 'text-slate-200' : 'text-slate-400'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Module Title */}
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-slate-400 font-mono">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
