import React, { useState } from 'react';
import { Building2, ShieldAlert, Mail, ExternalLink, FileText, Check, Globe, MapPin, Server, ShieldCheck, Phone, Landmark, Copy, AlertTriangle, FileCode, CheckCircle2, Link, Scale, UserCheck } from 'lucide-react';
import TakedownPdfModal from './TakedownPdfModal';
import MultiReportExportModal from './MultiReportExportModal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { downloadJson } from '../../utils/exportUtils';

export default function HostingAbuseCard({ officialReporting, domain, ip, cardSummary }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWebsite, setCopiedWebsite] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!officialReporting) return null;

  const host = officialReporting.hosting_provider || {};
  const reg = officialReporting.registrar || {};
  const asnOwner = officialReporting.asn_owner || {};

  const handleCopyEmail = () => {
    const emailStr = host.abuse_email || asnOwner.abuse_contact || 'abuse@provider.com';
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyWebsite = () => {
    const webStr = host.website || 'https://www.provider.com';
    navigator.clipboard.writeText(webStr);
    setCopiedWebsite(true);
    setTimeout(() => setCopiedWebsite(false), 2000);
  };

  return (
    <>
      <div className="bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6 font-mono text-xs text-slate-200">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-mono">
                  DEDICATED CONTACT INTEL
                </span>
                <Badge variant="success" size="sm" icon={ShieldCheck}>
                  VERIFIED OFFICIAL CHANNEL
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-white font-sans mt-0.5">
                Hosting Provider Contact Intelligence
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Confidence: <Badge variant="info">{host.confidence_level || 'HIGH'}</Badge></span>
            <span>Source: <Badge variant="neutral">{host.source || 'RDAP / WHOIS'}</Badge></span>
          </div>
        </div>

        {/* 3 Main Intel Sections: Hosting Provider, Registrar, ASN Owner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SECTION 1: HOSTING PROVIDER */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                {host.logo && (
                  <img src={host.logo} alt="Logo" className="w-4 h-4 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <span className="font-bold text-slate-100 font-sans text-sm">Hosting Provider</span>
              </div>
              <Badge variant="info" size="sm">HOST</Badge>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-cyan-300 text-sm font-sans truncate">{host.company_name}</div>
              <div className="flex justify-between text-slate-400">
                <span>Website:</span>
                <a href={host.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate max-w-[140px]">
                  {host.website?.replace('https://', '')}
                </a>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Abuse Email:</span>
                <span className="text-amber-300 font-semibold select-all truncate max-w-[140px]">{host.abuse_email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Email:</span>
                <span className="text-slate-200 truncate max-w-[140px]">{host.security_email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trust & Safety:</span>
                <span className="text-slate-300 truncate max-w-[140px]">{host.trust_safety_contact}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Legal Contact:</span>
                <span className="text-slate-300 truncate max-w-[140px]">{host.legal_contact}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: REGISTRAR */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="font-bold text-slate-100 font-sans text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" /> Registrar
              </span>
              <Badge variant="neutral" size="sm">ICANN</Badge>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-indigo-300 text-sm font-sans truncate">{reg.company_name}</div>
              <div className="flex justify-between text-slate-400">
                <span>Website:</span>
                <a href={reg.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate max-w-[140px]">
                  {reg.website?.replace('https://', '')}
                </a>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Abuse Email:</span>
                <span className="text-amber-300 font-semibold select-all truncate max-w-[140px]">{reg.abuse_email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Support Page:</span>
                <a href={reg.support_page} target="_blank" rel="noreferrer" className="text-slate-300 hover:underline truncate max-w-[140px]">
                  Support Portal
                </a>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Contact Page:</span>
                <a href={reg.contact_page} target="_blank" rel="noreferrer" className="text-slate-300 hover:underline truncate max-w-[140px]">
                  Contact Directory
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 3: ASN OWNER */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="font-bold text-slate-100 font-sans text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" /> ASN Owner
              </span>
              <Badge variant="warning" size="sm">{asnOwner.asn || 'ASN'}</Badge>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-emerald-300 text-sm font-sans truncate">{asnOwner.organization}</div>
              <div className="flex justify-between text-slate-400">
                <span>ASN Number:</span>
                <span className="text-cyan-300 font-semibold">{asnOwner.asn}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Website:</span>
                <a href={asnOwner.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate max-w-[140px]">
                  {asnOwner.website?.replace('https://', '')}
                </a>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Abuse Contact:</span>
                <span className="text-amber-300 truncate max-w-[140px]">{asnOwner.abuse_contact}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Contact:</span>
                <span className="text-slate-200 truncate max-w-[140px]">{asnOwner.security_contact}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 8 Required Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-800">
          <Button
            variant="primary"
            size="sm"
            icon={copiedEmail ? Check : Mail}
            onClick={handleCopyEmail}
          >
            {copiedEmail ? 'Copied!' : 'Copy Email'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={copiedWebsite ? Check : Link}
            onClick={handleCopyWebsite}
          >
            {copiedWebsite ? 'Copied!' : 'Copy Website'}
          </Button>

          <a href={host.website} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" icon={Globe}>
              Open Official Website
            </Button>
          </a>

          <a href={host.abuse_portal} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" icon={ExternalLink}>
              Open Abuse Portal
            </Button>
          </a>

          <a href={host.contact_page} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" icon={Phone}>
              Open Contact Page
            </Button>
          </a>

          <Button
            variant="secondary"
            size="sm"
            icon={FileCode}
            onClick={() => setShowReportModal(true)}
          >
            Generate Reporting Package
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={FileText}
            onClick={() => setShowPdfModal(true)}
          >
            Export PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={FileCode}
            onClick={() => downloadJson(officialReporting, `${domain || 'domain'}-contact-intel.json`)}
          >
            Export JSON
          </Button>
        </div>

      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <TakedownPdfModal
          officialReporting={officialReporting}
          domain={domain}
          ip={ip}
          cardSummary={cardSummary}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Multi Report Modal */}
      {showReportModal && (
        <MultiReportExportModal
          scanData={{ domain, cardSummary, modules: { officialReporting } }}
          domain={domain}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}
