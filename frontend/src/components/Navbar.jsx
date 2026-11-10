import React from 'react';
import { Shield, Search, History, GitCompare, Code2, Settings, Network, ShieldAlert, FolderKanban, Activity } from 'lucide-react';
import Badge from './ui/Badge';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Shield },
    { id: 'cases', label: 'Cases & FIRs', icon: FolderKanban },
    { id: 'checker', label: 'CyberGuard OSINT', icon: Search },
    { id: 'graph', label: 'Relationship Graph', icon: Network },
    { id: 'threat', label: 'Threat Intel', icon: ShieldAlert },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'docs', label: 'API Docs', icon: Code2 },
    { id: 'settings', label: 'Audit & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800 shadow-xl font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400 font-mono">
                  CYBERCRIME INVESTIGATION SUITE
                </span>
                <Badge variant="info" size="sm">GOV-OSINT v2.5</Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-none mt-0.5">Case Linkage & Hosting Intelligence Ecosystem</p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Engine Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-200 font-semibold">Engine Active</span>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <div className="lg:hidden flex items-center overflow-x-auto gap-2 py-2 border-t border-slate-800/80 text-xs font-mono no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg whitespace-nowrap transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
