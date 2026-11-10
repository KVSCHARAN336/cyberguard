import React from 'react';
import { Shield, Cpu, Lock, Network, Server, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cyber-cardBorder bg-[#050810] text-cyber-darkText text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-cyber-primary" />
              <span className="font-bold text-white tracking-wide">CyberGuard Platform</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Enterprise-grade domain intelligence, hosting provider resolution, CDN identification, and technology stack scanner built with independent parallel microservices.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Scanning Modules</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Network className="w-3.5 h-3.5 text-cyber-cyan" /> DNS Resolver (A, AAAA, MX, TXT)</li>
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-cyber-cyan" /> IP Intelligence & ASN</li>
              <li className="flex items-center gap-2"><Server className="w-3.5 h-3.5 text-cyber-cyan" /> CDN & DDoS Detector</li>
              <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-cyber-cyan" /> SSL Security Handshake</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Detected CMS & Stacks</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['WordPress', 'Shopify', 'Wix', 'React', 'Next.js', 'Angular', 'Vue', 'Laravel', 'Django', 'Express'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-cardBorder text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Non-blocking asynchronous parallel execution pipeline powered by Node.js & React 19.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-cyan text-xs">
              <Cpu className="w-3.5 h-3.5" /> 6 Independent Services Parallel
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-cyber-cardBorder/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CyberGuard Intelligence Platform. Built for Security Analysts & Engineers.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>REST API v1</span>
            <span>Status: 100% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
