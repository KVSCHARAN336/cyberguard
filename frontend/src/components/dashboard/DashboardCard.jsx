import React, { useState } from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';
import Badge from '../ui/Badge';
import EducationalModal from './EducationalModal';

export default function DashboardCard({
  icon: Icon,
  title,
  value,
  subtitle,
  badge,
  badgeType = 'info',
  simpleExplanation,
  whyItMatters,
  investigationUsage,
  source = 'DNS / WHOIS Registry',
  confidence = 'HIGH',
  knowledgeKey = 'domain',
  knowledgeData = null
}) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between font-mono text-xs space-y-4 group">
        
        {/* Technical Header & Value */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <span className="font-bold text-slate-200 text-xs font-sans uppercase tracking-wider">{title}</span>
            </div>

            {badge && (
              <Badge variant={badgeType} size="sm">
                {badge}
              </Badge>
            )}
          </div>

          <div>
            <div className="text-base font-extrabold text-white font-mono truncate" title={String(value)}>
              {value || 'N/A'}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">{subtitle}</div>
            )}
          </div>

          {/* Source Attribution & Confidence Rating */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
            <span>Source: <span className="text-cyan-300 font-semibold">{source}</span></span>
            <span className="flex items-center gap-1">
              Confidence: 
              <span className={`font-bold ${confidence === 'HIGH' ? 'text-emerald-400' : confidence === 'MEDIUM' ? 'text-amber-400' : 'text-slate-400'}`}>
                {confidence}
              </span>
            </span>
          </div>
        </div>

        {/* LEARN MORE BUTTON */}
        <div className="pt-2 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={() => setShowLearnMore(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-mono font-bold transition-all border border-slate-700 active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Learn More
          </button>
        </div>

      </div>

      {/* Educational Modal */}
      {showLearnMore && (
        <EducationalModal
          knowledgeKey={knowledgeKey}
          data={knowledgeData || {
            title: title,
            whatItIs: simpleExplanation || `Technical details regarding ${title}.`,
            howItWorks: `Operates at layer 7 of the OSI model using standard internet protocol specifications.`,
            realWorldExample: `In recent cybercrime cases, ${title} analysis was key to identifying criminal syndicate infrastructure.`,
            legalSignificance: whyItMatters || `Critical for court evidence submission and issuing warrants.`,
            bestPractices: investigationUsage || `Preserve digital forensic log evidence before taking down target sites.`
          }}
          onClose={() => setShowLearnMore(false)}
        />
      )}
    </>
  );
}
