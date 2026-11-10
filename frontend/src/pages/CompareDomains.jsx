import React, { useState } from 'react';
import { compareDomains } from '../api/scanApi';
import { GitCompare, Loader2, Trophy, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function CompareDomains() {
  const [domainA, setDomainA] = useState('github.com');
  const [domainB, setDomainB] = useState('gitlab.com');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!domainA.trim() || !domainB.trim()) {
      setError('Please provide two valid domains to compare.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await compareDomains(domainA.trim(), domainB.trim());
      if (res.success) {
        setComparisonResult(res.comparison);
      } else {
        setError(res.error || 'Failed to compare domains');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during comparison');
    } finally {
      setIsLoading(false);
    }
  };

  const compA = comparisonResult?.domainA?.cardSummary;
  const compB = comparisonResult?.domainB?.cardSummary;

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <PageHeader
        badge="COMPARATOR"
        title="Side-by-Side Infrastructure Comparator"
        subtitle="Analyze hosting providers, CDN shields, SSL validity, and response latencies side-by-side"
        breadcrumb={['Suite', 'Compare Domains']}
      />

      {/* Input Form */}
      <Card hoverable={false} className="max-w-3xl mx-auto">
        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2">
              <Input
                label="Domain A"
                value={domainA}
                onChange={(e) => setDomainA(e.target.value)}
                placeholder="Domain A (e.g. github.com)"
              />
            </div>

            <div className="text-center font-black font-mono text-cyan-400 text-sm">VS</div>

            <div className="md:col-span-2">
              <Input
                label="Domain B"
                value={domainB}
                onChange={(e) => setDomainB(e.target.value)}
                placeholder="Domain B (e.g. gitlab.com)"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Running Parallel Comparison...' : 'Run Side-by-Side Comparison'}
          </Button>
        </form>

        {error && <p className="mt-2 text-xs text-rose-400 font-mono text-center">{error}</p>}
      </Card>

      {/* Comparison Results Grid */}
      {comparisonResult && compA && compB && (
        <div className="space-y-8 font-mono text-xs animate-in fade-in duration-300">
          
          {/* Winners Highlights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverable={false} className="border-emerald-500/40">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">FASTER HTTP RESPONSE:</span>
                  <div className="text-lg font-bold text-emerald-400 font-sans">{comparisonResult.winner.fasterResponse}</div>
                </div>
              </div>
            </Card>

            <Card hoverable={false} className="border-cyan-500/40">
              <div className="flex items-center gap-4">
                <Globe className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">MORE DNS ZONE RECORDS:</span>
                  <div className="text-lg font-bold text-cyan-400 font-sans">{comparisonResult.winner.moreDnsRecords}</div>
                </div>
              </div>
            </Card>

            <Card hoverable={false} className="border-indigo-500/40">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">LONGER SSL VALIDITY:</span>
                  <div className="text-lg font-bold text-indigo-400 font-sans">{comparisonResult.winner.sslDaysLeft}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Side-by-Side Matrix Table */}
          <Card header={
            <h3 className="font-bold text-xl text-slate-100 font-sans">Side-by-Side Parameter Matrix</h3>
          }>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Technical Metric</th>
                    <th className="py-3 px-4 font-bold text-cyan-400">{compA.domain}</th>
                    <th className="py-3 px-4 font-bold text-indigo-400">{compB.domain}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Hosting Provider</td>
                    <td className="py-3 px-4 font-bold text-white">{compA.hostingProvider}</td>
                    <td className="py-3 px-4 font-bold text-white">{compB.hostingProvider}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Primary IP Address</td>
                    <td className="py-3 px-4 text-cyan-300">{compA.ip}</td>
                    <td className="py-3 px-4 text-indigo-300">{compB.ip}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Autonomous System (ASN)</td>
                    <td className="py-3 px-4">{compA.asn}</td>
                    <td className="py-3 px-4">{compB.asn}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">CDN Edge Shield</td>
                    <td className="py-3 px-4"><Badge variant="info">{compA.cdn}</Badge></td>
                    <td className="py-3 px-4"><Badge variant="info">{compB.cdn}</Badge></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">CMS Engine</td>
                    <td className="py-3 px-4">{compA.cms}</td>
                    <td className="py-3 px-4">{compB.cms}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">SSL Certificate Status</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{compA.sslStatus} ({compA.sslDaysLeft} days)</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{compB.sslStatus} ({compB.sslDaysLeft} days)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">HTTP Response Time</td>
                    <td className="py-3 px-4 font-bold text-white">{compA.responseTimeMs} ms</td>
                    <td className="py-3 px-4 font-bold text-white">{compB.responseTimeMs} ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      )}
    </div>
  );
}
