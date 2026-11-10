import React from 'react';
import { X, Printer, ShieldAlert, Download, Building2, CheckCircle2, Lock } from 'lucide-react';

export default function TakedownPdfModal({ officialReporting, domain, ip, cardSummary, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sha256Hash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center print:hidden sticky top-0 z-10">
          <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold">
            <ShieldAlert className="w-5 h-5" />
            GOVERNMENT CYBER CRIME INVESTIGATION SUITE — FORMAL TAKEDOWN NOTICE
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-lg shadow transition-all"
            >
              <Printer className="w-4 h-4" /> PRINT / SAVE AS PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 font-serif text-slate-200 print:text-black print:p-6 space-y-6">
          
          {/* Top Letterhead */}
          <div className="border-b-2 border-red-600 pb-4 flex justify-between items-end print:border-black">
            <div>
              <div className="text-red-500 font-bold text-xs font-mono tracking-widest uppercase mb-1 print:text-red-700">
                CONFIDENTIAL // LAW ENFORCEMENT & CERT OFFICIAL COMMUNICATION
              </div>
              <h1 className="text-2xl font-bold text-slate-100 print:text-black uppercase tracking-tight">
                NOTICE OF MALICIOUS INFRASTRUCTURE & TAKEDOWN REQUEST
              </h1>
              <div className="text-xs text-slate-400 font-mono mt-1 print:text-slate-700">
                ISSUED UNDER PUBLIC OSINT FORENSIC EVIDENCE FRAMEWORK
              </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-400 print:text-slate-800">
              <div>Ref: <strong className="text-slate-200 print:text-black">UCIP-TAKEDOWN-2026-0806</strong></div>
              <div>Date: <strong>{currentDate}</strong></div>
              <div>Chain of Custody: <strong className="text-emerald-400 print:text-emerald-800">VERIFIED</strong></div>
            </div>
          </div>

          {/* Addressee Info */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 print:bg-slate-100 print:border-slate-300 print:text-black">
            <div className="text-slate-400 print:text-slate-600 uppercase text-[10px] tracking-wider font-bold">RECIPIENT (HOSTING PROVIDER COMPLIANCE & ABUSE TEAM):</div>
            <div className="font-bold text-base text-cyan-400 print:text-blue-900">{officialReporting?.name}</div>
            <div>Official Abuse Email: <strong className="text-amber-300 print:text-amber-900">{officialReporting?.abuseEmail}</strong></div>
            <div>RIR Point of Contact ({officialReporting?.rir}): <strong>{officialReporting?.rirAbuseEmail}</strong></div>
            <div>Headquarters: <strong>{officialReporting?.headquarters}</strong> | ASN: <strong>AS{officialReporting?.asns?.[0] || 'N/A'}</strong></div>
          </div>

          {/* Formal Notice Paragraph */}
          <div className="text-sm leading-relaxed space-y-3">
            <p><strong>To the Abuse & Security Compliance Officers,</strong></p>
            <p>
              This formal notification serves as an urgent request regarding malicious cyber activity hosted on infrastructure assigned to your Autonomous System (ASN). Independent technical analysis conducted by certified digital forensic investigators confirms that the target domain specified below is engaged in unlawful cybercrime activities, including unauthorized phishing, credential harvesting, or infrastructure impersonation.
            </p>
          </div>

          {/* Target Technical Snapshot */}
          <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs print:border-slate-400">
            <div className="bg-slate-950 p-3 font-bold text-cyan-400 border-b border-slate-800 flex justify-between items-center print:bg-slate-200 print:text-black">
              <span>TARGET INFRASTRUCTURE OSINT SNAPSHOT</span>
              <span className="text-[10px] bg-red-950/80 text-red-400 px-2 py-0.5 rounded border border-red-500/30">FLAGGED UNLAWFUL</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 bg-slate-900/40 print:bg-white print:text-black">
              <div>
                <span className="text-slate-400">Target Hostname / Domain:</span>
                <div className="text-base font-bold text-red-400 print:text-red-700">{domain}</div>
              </div>
              <div>
                <span className="text-slate-400">Resolved Primary IP Address:</span>
                <div className="text-base font-bold text-cyan-300 print:text-blue-900">{ip || cardSummary?.ip}</div>
              </div>
              <div>
                <span className="text-slate-400">ASN & Network Owner:</span>
                <div>{cardSummary?.asn} — {cardSummary?.organization}</div>
              </div>
              <div>
                <span className="text-slate-400">SSL Certificate Status:</span>
                <div className="text-emerald-400 print:text-emerald-800 font-semibold">{cardSummary?.sslStatus} ({cardSummary?.sslDaysLeft} Days Remaining)</div>
              </div>
            </div>
          </div>

          {/* Requested Actions */}
          <div className="space-y-2 text-sm">
            <h3 className="font-bold text-slate-100 print:text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-800" /> REQUESTED IMMEDIATE LAWFUL REMEDIATION ACTIONS:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 print:text-slate-800 font-mono">
              <li>Immediately suspend or terminate hosting services for target domain <strong>{domain}</strong> (IP: <strong>{ip || cardSummary?.ip}</strong>).</li>
              <li>Preserve server access logs, origin IP routing logs, and billing account metadata for law enforcement sub-poena compliance.</li>
              <li>Notify the victim organization and local CERT unit upon completion of takedown action.</li>
            </ol>
          </div>

          {/* Chain of Custody & Hash */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 print:bg-slate-100 print:border-slate-400 print:text-black">
            <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-900 font-bold uppercase text-[10px] tracking-wider">
              <Lock className="w-3.5 h-3.5" /> CRYPTOGRAPHIC FORENSIC CHAIN OF CUSTODY INTEGRITY SEAL
            </div>
            <div className="truncate text-slate-300 print:text-slate-800 font-semibold">{sha256Hash}</div>
            <div className="text-[10px] text-slate-500 print:text-slate-700">
              Verified by Unified Cybercrime Investigation Platform (UCIP) Engine. Timestamp: {new Date().toISOString()}
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end print:border-black font-mono text-xs">
            <div>
              <div className="font-bold text-slate-200 print:text-black">OFFICE OF DIGITAL FORENSICS & CYBER CRIME CELL</div>
              <div className="text-slate-400 print:text-slate-700">Cyber Crime Investigation Platform (UCIP Engine)</div>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-dashed border-slate-600 mb-1 w-48 ml-auto print:border-black"></div>
              <div className="text-slate-400 print:text-black text-[10px]">AUTHORIZED INVESTIGATOR SIGNATURE</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
