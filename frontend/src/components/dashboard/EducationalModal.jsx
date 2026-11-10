import React from 'react';
import { BookOpen, ShieldCheck, X, FileText, CheckCircle2, ArrowRight, Info, AlertTriangle, Scale, Search, Lightbulb } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function EducationalModal({ knowledgeKey, data, onClose }) {
  if (!data) return null;

  const diagrams = {
    domain: `[ User / Victim ] ──► [ Web Browser ] ──► [ DNS Resolver ] ──► [ Domain Registrar (GoDaddy/Hostinger) ]`,
    dns: `[ Phishing Domain ] ──► [ DNS A Record ] ──► [ Target IP: 104.21.58.192 ] ──► [ Malicious Web Host ]`,
    ip: `[ Suspect IP ] ──► [ Autonomous System (ASN) ] ──► [ ISP / Data Center ] ──► [ Physical Server Machine ]`,
    hosting: `[ Phishing Kit Files ] ──► [ Web Server Engine (Nginx/Apache) ] ──► [ Backend PHP/Node.js ] ──► [ Database ]`,
    ssl: `[ Victim Browser ] ──► [ HTTPS Request ] ──► [ SSL/TLS Cert (Let's Encrypt) ] ──► [ Encrypted Session ]`,
    cdn: `[ Visitor ] ──► [ Cloudflare Edge Proxy (Public IP) ] ──► [ Shielded Origin Server (Hidden Real IP) ]`,
    tech: `[ Target Website ] ──► [ CMS (WordPress) ] ──► [ Phishing Kit Plugin ] ──► [ Credential Exfiltrator ]`
  };

  const currentDiagram = diagrams[knowledgeKey] || diagrams.domain;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 space-y-6 font-mono text-xs text-slate-200 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <Badge variant="info" size="sm">LEGAL & OSINT EDUCATIONAL INTELLIGENCE</Badge>
              <h2 className="text-xl font-bold text-white font-sans mt-1">{data.title || 'Technical Infrastructure Deep-Dive'}</h2>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
        </div>

        {/* Visual Architecture Flowchart */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            TECHNICAL ARCHITECTURE & DATA FLOW DIAGRAM:
          </span>
          <pre className="p-3 bg-slate-900/90 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
            <code>{currentDiagram}</code>
          </pre>
        </div>

        {/* 3 Explicit Callout Cards requested by user */}
        <div className="space-y-4 font-sans">
          
          {/* 1. SIMPLE EXPLANATION */}
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>💡 SIMPLE EXPLANATION:</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {data.whatItIs || data.simpleExplanation || 'Technical artifact operating at the infrastructure layer of the target domain.'}
            </p>
            {data.howItWorks && (
              <p className="text-slate-400 text-xs leading-relaxed pt-1 border-t border-slate-800/80">
                {data.howItWorks}
              </p>
            )}
          </div>

          {/* 2. WHY IT MATTERS */}
          <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>⚠️ WHY IT MATTERS:</span>
            </div>
            <p className="text-amber-200 text-sm leading-relaxed">
              {data.whyItMatters || data.legalSignificance || 'Crucial for identifying cybercrime infrastructure and correlating target domains across cases.'}
            </p>
            {data.realWorldExample && (
              <p className="text-amber-300/80 text-xs italic leading-relaxed pt-1 border-t border-amber-500/20">
                "{data.realWorldExample}"
              </p>
            )}
          </div>

          {/* 3. INVESTIGATION USAGE */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>🔍 INVESTIGATION USAGE:</span>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              {data.investigationUsage || data.bestPractices || 'Issue formal preservation notices (CrPC Section 91 / 18 U.S.C. § 2703(f)) and subpoenas to host/registrar.'}
            </p>
          </div>

          {/* 4. DIGITAL FORENSICS BEST PRACTICES */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>📜 LEGAL SUBPOENA & DIGITAL FORENSIC BEST PRACTICES:</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {data.bestPractices || 'Preserve exact raw HTTP headers, DNS zone records, and cryptographic SSL fingerprints before issuing notice.'}
            </p>
          </div>

        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>Understood & Close</Button>
        </div>

      </div>
    </div>
  );
}
