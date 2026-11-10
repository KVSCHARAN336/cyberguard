import React, { useState } from 'react';
import {
  Building2,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldOff,
  UserRound
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

function DetailRow({ icon: Icon, label, value, accent = 'text-slate-100' }) {
  return (
    <div className="grid grid-cols-[1.1rem_minmax(6rem,0.7fr)_minmax(0,1.3fr)] gap-2 items-start py-2.5 border-b border-slate-800/70 last:border-0">
      <Icon className="w-4 h-4 text-slate-500 mt-0.5" />
      <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">{label}</span>
      <span className={`text-right break-words font-medium ${value ? accent : 'text-slate-500 italic'}`}>
        {value || 'Not publicly disclosed'}
      </span>
    </div>
  );
}

export default function RegistrantOwnerCard({ whoisData, ipCrossCheck, domain }) {
  const [copied, setCopied] = useState(false);
  if (!whoisData) return null;

  const hasPublicRegistrantData = Boolean(whoisData.hasPublicRegistrantData);
  const publicEmail = whoisData.registrantEmail || whoisData.adminEmail;

  const copyEmail = async () => {
    if (!publicEmail) return;
    await navigator.clipboard.writeText(publicEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
      <header className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold tracking-[0.16em] text-cyan-300 uppercase">Public RDAP record</span>
                <Badge variant={hasPublicRegistrantData ? 'success' : 'neutral'} size="sm" icon={hasPublicRegistrantData ? ShieldCheck : ShieldOff}>
                  {hasPublicRegistrantData ? 'PUBLIC CONTACT AVAILABLE' : 'REDACTED OR UNAVAILABLE'}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Website ownership & reporting contacts</h2>
              <p className="mt-1 text-xs text-slate-400">Public registration data only. Private registration details are not inferred or substituted.</p>
            </div>
          </div>

          {ipCrossCheck && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">Resolution check</span>
              <span className={ipCrossCheck.match ? 'text-emerald-300' : 'text-cyan-300'}>
                {ipCrossCheck.match ? `DNS verified: ${ipCrossCheck.ip}` : ipCrossCheck.message}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {!hasPublicRegistrantData && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs text-amber-100/90">
            The registry does not publicly disclose a registrant contact for this domain. Use the registrar or hosting provider’s verified abuse and legal-reporting channels for official requests.
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="flex items-center gap-2 font-semibold text-slate-100"><UserRound className="w-4 h-4 text-cyan-300" /> Registrant / website owner</h3>
              <Badge variant={hasPublicRegistrantData ? 'success' : 'neutral'} size="sm">{hasPublicRegistrantData ? 'DISCLOSED' : 'NOT DISCLOSED'}</Badge>
            </div>
            <div className="mt-1">
              <DetailRow icon={UserRound} label="Name" value={whoisData.registrantName} accent="text-cyan-200" />
              <DetailRow icon={Building2} label="Organisation" value={whoisData.registrantOrganization} />
              <DetailRow icon={Mail} label="Email" value={whoisData.registrantEmail} accent="text-amber-200" />
              <DetailRow icon={Phone} label="Phone" value={whoisData.registrantPhone} accent="text-emerald-200" />
              <DetailRow icon={MapPin} label="Address" value={whoisData.registrantAddress} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="flex items-center gap-2 font-semibold text-slate-100"><Globe2 className="w-4 h-4 text-indigo-300" /> Registration & administrative data</h3>
              <Badge variant="info" size="sm">RDAP</Badge>
            </div>
            <div className="mt-1">
              <DetailRow icon={UserRound} label="Admin" value={whoisData.adminName} />
              <DetailRow icon={Mail} label="Admin email" value={whoisData.adminEmail} accent="text-amber-200" />
              <DetailRow icon={Building2} label="Registrar" value={whoisData.registrarName} accent="text-indigo-200" />
              <DetailRow icon={CalendarDays} label="Registered" value={whoisData.registrationDate} />
              <DetailRow icon={CalendarDays} label="Expires" value={whoisData.expiryDate} accent="text-emerald-200" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-500">
            Source: <span className="text-slate-300">{whoisData.source || 'RDAP'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={copyEmail} disabled={!publicEmail}>
              {copied ? 'Copied' : 'Copy public email'}
            </Button>
            <a href={whoisData.sourceUrl || `https://rdap.org/domain/${encodeURIComponent(domain || '')}`} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" icon={ExternalLink}>Open RDAP record</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
