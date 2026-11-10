import React from 'react';
import { X, Code, ExternalLink } from 'lucide-react';

export default function RawHeadersModal({ isOpen, onClose, httpData }) {
  if (!isOpen || !httpData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b1222] border border-cyber-cardBorder rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cardBorder bg-[#080d18]">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-cyber-cyan" />
            <h3 className="text-lg font-bold text-white font-mono">Raw HTTP Response Headers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-cardBorder transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {/* Redirect Chain */}
          {httpData.redirects && httpData.redirects.length > 0 && (
            <div>
              <h4 className="text-cyber-cyan font-bold mb-2 uppercase text-[11px] tracking-wider">
                Redirect Trace Chain ({httpData.redirects.length} steps)
              </h4>
              <div className="p-3 rounded-xl bg-[#050810] border border-cyber-cardBorder space-y-1">
                {httpData.redirects.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500">#{idx + 1}</span>
                    <span className="truncate">{url}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Value Headers */}
          <div>
            <h4 className="text-cyber-cyan font-bold mb-2 uppercase text-[11px] tracking-wider">
              Headers Array ({httpData.rawHeaders?.length || 0})
            </h4>
            <div className="p-4 rounded-xl bg-[#050810] border border-cyber-cardBorder space-y-2 max-h-96 overflow-y-auto">
              {httpData.rawHeaders?.map((h, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 border-b border-cyber-cardBorder/30 pb-1.5 last:border-0">
                  <span className="text-cyber-cyan font-semibold truncate">{h.name}:</span>
                  <span className="col-span-2 text-slate-300 break-all">{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cyber-cardBorder bg-[#080d18] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyber-primary text-white font-semibold text-xs hover:brightness-110 transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
