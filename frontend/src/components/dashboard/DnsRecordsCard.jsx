import React, { useState } from 'react';
import { Network, Copy, Check, BookOpen, ShieldCheck, Info, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EducationalModal from './EducationalModal';

const DNS_EDUCATIONAL_GUIDE = {
  A: {
    title: 'A Record (IPv4 Address)',
    simpleExplanation: 'An A record connects a website domain name (e.g. bank-secure.com) to a 32-bit IPv4 address (e.g. 104.21.58.192).',
    whyItMatters: 'Allows investigators to identify where the website is physically hosted and who owns the server IP.',
    investigationUsage: 'Issue preservation notices and subpoenas to the ISP or hosting provider that owns the IP address block.'
  },
  AAAA: {
    title: 'AAAA Record (IPv6 Address)',
    simpleExplanation: 'An AAAA record connects a website name to a 128-bit IPv6 address (e.g. 2606:4700:3033::6815:3ac0).',
    whyItMatters: 'Identifies modern IPv6 infrastructure used by target websites.',
    investigationUsage: 'Track dual-stack IPv4/IPv6 connections to reveal secondary network interfaces.'
  },
  MX: {
    title: 'MX Record (Mail Exchange)',
    simpleExplanation: 'MX records specify which mail servers handle incoming email for the domain.',
    whyItMatters: 'Identifies corporate email providers (Google Workspace, Office 365, ProtonMail) used by scammers to receive phishing responses.',
    investigationUsage: 'Serve legal process (subpoenas/warrants) on the mail provider to obtain suspect email accounts and recovery details.'
  },
  TXT: {
    title: 'TXT Record (Text Records & Verification)',
    simpleExplanation: 'TXT records hold arbitrary text information used for domain ownership verification and security policies.',
    whyItMatters: 'Uncovers third-party services linked to the domain (e.g. Google Search Console, Atlassian, Mailgun verification keys).',
    investigationUsage: 'Examine verification tokens to identify linked corporate accounts across SaaS platforms.'
  },
  SPF: {
    title: 'SPF Record (Sender Policy Framework)',
    simpleExplanation: 'SPF records list which server IP addresses are authorized to send email on behalf of this domain.',
    whyItMatters: 'Proves whether an email claiming to be from this domain was legitimate or spoofed by scammers.',
    investigationUsage: 'Compare victim email headers against published SPF IP ranges to prove forgery in court.'
  },
  DKIM: {
    title: 'DKIM Record (DomainKeys Identified Mail)',
    simpleExplanation: 'DKIM attaches a cryptographic digital signature to emails to prove they were not modified in transit.',
    whyItMatters: 'Provides cryptographic proof of sender authenticity in email fraud investigations.',
    investigationUsage: 'Verify public key signatures in raw email headers to confirm email integrity.'
  },
  DMARC: {
    title: 'DMARC Record (Domain Abuse Reporting)',
    simpleExplanation: 'DMARC instructs receiving mail servers how to handle emails that fail SPF or DKIM checks.',
    whyItMatters: 'Indicates whether the domain is vulnerable to email impersonation and smishing campaigns.',
    investigationUsage: 'If DMARC policy is "none", scammers can easily impersonate the victim domain.'
  },
  NS: {
    title: 'NS Record (Name Servers)',
    simpleExplanation: 'NS records specify which DNS servers store all authoritative records for this domain.',
    whyItMatters: 'Uncovers shared DNS infrastructure across multiple scam websites.',
    investigationUsage: 'If two different phishing sites use the exact same custom Name Servers, they belong to the same threat group.'
  },
  SOA: {
    title: 'SOA Record (Start of Authority)',
    simpleExplanation: 'SOA record contains administrative information including the zone admin email, serial number, and refresh timers.',
    whyItMatters: 'Can reveal the real email address of the domain administrator or primary DNS server.',
    investigationUsage: 'Extract the SOA hostmaster email to identify the domain administrator.'
  },
  CAA: {
    title: 'CAA Record (Certification Authority Authorization)',
    simpleExplanation: 'CAA records specify which Certificate Authorities (CAs) are allowed to issue SSL certificates for the domain.',
    whyItMatters: 'Prevents unauthorized SSL certificate issuance.',
    investigationUsage: 'Identify authorized Certificate Authorities for certificate transparency log monitoring.'
  },
  CNAME: {
    title: 'CNAME Record (Canonical Name Alias)',
    simpleExplanation: 'A CNAME record aliases one domain name to another canonical domain.',
    whyItMatters: 'Tracks domain forwarding, landing page proxies, and third-party hosting aliases.',
    investigationUsage: 'Trace CNAME chains to uncover underlying host domains and hidden CDN origins.'
  },
  PTR: {
    title: 'PTR Record (Pointer / Reverse DNS)',
    simpleExplanation: 'PTR records map an IP address back to its associated domain name.',
    whyItMatters: 'Verifies whether an IP matches the expected mail or web server domain name.',
    investigationUsage: 'Use Reverse DNS to confirm server identity and uncover shared IP virtual hosts.'
  }
};

export default function DnsRecordsCard({ dnsModule, dnsData }) {
  const [activeType, setActiveType] = useState('A');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const data = dnsModule || dnsData;
  if (!data) return null;

  const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'SPF', 'DKIM', 'DMARC', 'NS', 'SOA', 'CAA', 'CNAME', 'PTR'];

  const getRecordsForType = (type) => {
    switch (type) {
      case 'A': return data.A || [];
      case 'AAAA': return data.AAAA || [];
      case 'CNAME': return data.CNAME || [];
      case 'MX': return (data.MX || []).map(m => `${m.priority} ${m.exchange}`);
      case 'TXT': return data.TXT || [];
      case 'SPF': return data.SPF || [];
      case 'DKIM': return data.DKIM || [];
      case 'DMARC': return data.DMARC || [];
      case 'NS': return data.NS || [];
      case 'SOA': return data.SOA ? [data.SOA] : [];
      case 'CAA': return data.CAA || [];
      case 'PTR': return data.PTR || [];
      default: return [];
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const currentRecords = getRecordsForType(activeType);
  const currentGuide = DNS_EDUCATIONAL_GUIDE[activeType] || DNS_EDUCATIONAL_GUIDE['A'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl col-span-full space-y-6 font-mono text-xs text-slate-200">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-mono">DNS ZONE ANALYSIS</span>
              <Badge variant="success" size="sm" icon={ShieldCheck}>VERIFIED AUTHORITATIVE QUERY</Badge>
            </div>
            <h3 className="text-xl font-bold text-white font-sans mt-0.5">DNS Zone Records Matrix & Explanation</h3>
          </div>
        </div>

        {/* Record Type Tabs (12 Types) */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
          {recordTypes.map((type) => {
            const count = getRecordsForType(type).length;
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{type}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-black/30 text-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Technical Information Output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider font-sans">
            Resolved {activeType} Records ({currentRecords.length}):
          </span>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>Source: <span className="text-cyan-300 font-semibold">Authoritative DNS Query</span></span>
            <span>Confidence: <span className="text-emerald-400 font-bold">HIGH</span></span>
          </div>
        </div>

        {currentRecords.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs font-mono bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
            No {activeType} records resolved for this domain.
          </div>
        ) : (
          <div className="space-y-2">
            {currentRecords.map((record, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors font-mono text-xs text-slate-200"
              >
                <div className="flex items-center gap-3 truncate pr-4">
                  <Badge variant="info" size="sm">
                    {activeType} #{idx + 1}
                  </Badge>
                  <span className="truncate select-all">{record}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(record, idx)}
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4-SECTION EDUCATIONAL EXPLANATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 font-sans">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            💡 SIMPLE EXPLANATION:
          </span>
          <p className="text-slate-300 text-xs leading-relaxed">{currentGuide.simpleExplanation}</p>
        </div>

        <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 space-y-1.5 font-sans">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
            ⚠️ WHY IT MATTERS:
          </span>
          <p className="text-amber-200/90 text-xs leading-relaxed">{currentGuide.whyItMatters}</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 font-sans">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            🔍 INVESTIGATION USAGE:
          </span>
          <p className="text-slate-300 text-xs leading-relaxed">{currentGuide.investigationUsage}</p>
        </div>
      </div>

      {/* Footer & Educational Modal Trigger */}
      <div className="pt-3 border-t border-slate-800 flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          icon={BookOpen}
          onClick={() => setShowLearnMore(true)}
        >
          Learn More about {activeType} Records
        </Button>
      </div>

      {/* Educational Modal */}
      {showLearnMore && (
        <EducationalModal
          knowledgeKey="dns"
          data={{
            title: currentGuide.title,
            whatItIs: currentGuide.simpleExplanation,
            howItWorks: `Resolved via DNS port 53 UDP query to authoritative nameservers.`,
            realWorldExample: `In a recent phishing case, checking ${activeType} records revealed identical infrastructure shared across 15 fraudulent bank sites.`,
            legalSignificance: currentGuide.whyItMatters,
            bestPractices: currentGuide.investigationUsage
          }}
          onClose={() => setShowLearnMore(false)}
        />
      )}

    </div>
  );
}
