import React, { useState, useEffect } from 'react';
import { Network, Globe, Server, Shield, Cpu, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function ScanningSkeleton({ targetDomain }) {
  const steps = [
    { label: 'Resolving DNS Records (A, AAAA, MX, CNAME, TXT, NS)...', icon: Network },
    { label: 'Querying IP Intelligence, ASN & Geo-Location...', icon: Globe },
    { label: 'Probing HTTP Engine, Response Latency & Headers...', icon: Server },
    { label: 'Executing TLS Certificate Handshake & SSL Expiry...', icon: Lock },
    { label: 'Evaluating CDN Shield & Edge Infrastructure...', icon: Shield },
    { label: 'Fingerprinting CMS, Frameworks & Tech Stack...', icon: Cpu },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-cyber-card border border-cyber-cardBorder rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Laser scan line animation */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-scan-line"></div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/20 border border-cyber-primary/40 text-cyber-cyan text-xs font-mono mb-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Parallel Execution Microservices
        </div>
        <h3 className="text-2xl font-extrabold text-white">
          Inspecting <span className="text-cyber-cyan font-mono">{targetDomain || 'Target'}</span>
        </h3>
        <p className="text-sm text-cyber-darkText mt-1">Executing 6 independent detection modules in parallel</p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-cyber-primary/10 border-cyber-primary text-white shadow-lg'
                  : isDone
                  ? 'bg-cyber-cardBorder/30 border-emerald-500/40 text-slate-300'
                  : 'bg-cyber-cardBorder/10 border-transparent text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin shrink-0" />
              ) : (
                <Icon className="w-5 h-5 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-mono font-medium leading-snug">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Skeleton Card Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-cyber-cardBorder/40 animate-pulse p-4 flex flex-col justify-between">
            <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
            <div className="h-6 w-36 bg-slate-600/50 rounded"></div>
            <div className="h-3 w-16 bg-slate-700/50 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
