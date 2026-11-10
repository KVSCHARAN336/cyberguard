import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Shield, Network, Globe, Server, Cpu, Lock, ArrowRight, Zap, Database, Folder, ShieldAlert, Landmark, TrendingUp, Coins } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function Home({ onSearchDomain, setActivePage }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/stats').then(res => {
      if (res.data.success) setStats(res.data.stats);
    }).catch(() => {});
  }, []);

  const handleSearch = (domain) => {
    onSearchDomain(domain);
  };

  const scamCategories = [
    { name: 'Banking & Phishing Scams', icon: Landmark, desc: 'Netbanking harvesters & OTP smishing links', loss: '₹3.75 Crores' },
    { name: 'Investment & Task Fraud', icon: TrendingUp, desc: 'Part-time Telegram tasks & fake trading apps', loss: '₹1.04 Crores' },
    { name: 'Digital Arrest & Impersonation', icon: ShieldAlert, desc: 'Fake police/CBI video call extortion', loss: '₹8.20 Crores' },
    { name: 'Ransomware & Infrastructure', icon: Lock, desc: 'Hospital system lock & C2 servers', loss: '₹12.50 Crores' },
    { name: 'UPI & Crypto Asset Fraud', icon: Coins, desc: 'QR code stickers & money laundering', loss: '₹45 Lakhs' },
  ];

  return (
    <div className="space-y-16 font-sans">
      {/* Hero Section */}
      <section className="text-center relative max-w-4xl mx-auto px-4 pt-4 space-y-6">
        <Badge variant="info" size="lg" icon={Zap}>
          GOVERNMENT-GRADE OSINT & CASE CLASSIFICATION SUITE
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          Unified <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Cybercrime Investigation</span> Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-mono leading-relaxed">
          Integrated Case Linkage, Multimodal Evidence Vault, CyberGuard Website Intelligence & Classified Cybercrime Scam Folders (Rupees ₹ Only).
        </p>

        {/* Central Search Bar */}
        <Card hoverable={false} className="p-4">
          <SearchBar onSearch={handleSearch} />
        </Card>

        {/* Stats Row (IN RUPEES ₹ ONLY) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 font-mono text-xs text-left">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">TOTAL FINANCIAL LOSS:</span>
            <span className="text-emerald-400 font-black text-lg">{stats?.totalFinancialLossInr || '₹17.89 Crores'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">REGISTERED FIRS & CASES:</span>
            <span className="text-cyan-400 font-black text-lg">{stats?.totalCases || 6} Active Cases</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">SCAM CATEGORY FOLDERS:</span>
            <span className="text-amber-400 font-black text-lg">6 Classified Folders</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">PARALLEL OSINT MODULES:</span>
            <span className="text-slate-200 font-black text-lg">8 Active Services</span>
          </div>
        </div>
      </section>

      {/* Classified Cybercrime Scam Folders Section */}
      <section className="max-w-[1600px] mx-auto px-4 font-mono space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <Folder className="w-6 h-6 text-cyan-400" /> Classified Cybercrime Scam Folders
            </h2>
            <p className="text-xs text-slate-400 mt-1">Classified by scam typology with financial losses calculated in Indian Rupees (₹)</p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            onClick={() => setActivePage('cases')}
          >
            OPEN ALL SCAM FOLDERS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scamCategories.map((scam, idx) => {
            const IconComp = scam.icon;
            return (
              <Card
                key={idx}
                onClick={() => setActivePage('cases')}
                className="cursor-pointer space-y-4 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="success" size="md">
                    {scam.loss}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-lg font-sans group-hover:text-cyan-300 transition-colors">{scam.name}</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">{scam.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
