import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, AlertTriangle, ShieldCheck, Database, Server, Bug, FileCode, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function ThreatIntel() {
  const [indicator, setIndicator] = useState('104.21.58.192');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchThreatIntel = async (queryInput) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/threat-intel?indicator=${encodeURIComponent(queryInput || indicator)}`);
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch threat intel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatIntel('104.21.58.192');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (indicator) fetchThreatIntel(indicator);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <PageHeader
        badge="THREAT RADAR"
        title="Threat Intelligence & Reputation Radar"
        subtitle="Real-time passive lookup across VirusTotal, AbuseIPDB, URLhaus, and Known IOC Databases"
        breadcrumb={['Suite', 'Threat Intelligence']}
      />

      {/* Search Bar */}
      <Card hoverable={false}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            icon={Search}
            placeholder="Enter IP Address, Domain Name, or SHA256 Hash to query reputation score..."
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full sm:w-auto shrink-0"
          >
            {loading ? 'ANALYZING...' : 'QUERY REPUTATION'}
          </Button>
        </form>

        {/* Sample Indicators */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-400">
          <span className="text-[10px] uppercase font-bold text-slate-500">Sample IOC Queries:</span>
          {['104.21.58.192', '185.220.101.5', 'hsb-banking-secure-auth.com', 'github.com'].map((item) => (
            <button
              key={item}
              onClick={() => { setIndicator(item); fetchThreatIntel(item); }}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 rounded hover:text-cyan-400 transition-all text-xs"
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {/* Threat Report View */}
      {report && (
        <div className="space-y-8 font-mono text-xs">
          
          {/* Main Risk Scorecard */}
          <Card hoverable={false}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">TARGET INDICATOR REPORT:</span>
                <h2 className="text-2xl font-bold text-slate-100 font-sans truncate">{report.indicator}</h2>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>Type: <Badge variant="info">{report.type}</Badge></span>
                  <span>Country: <Badge variant="neutral">{report.country}</Badge></span>
                </div>
              </div>

              <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">NORMALIZED RISK SCORE</span>
                <div className={`text-3xl font-black ${report.riskScore > 70 ? 'text-red-500' : report.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {report.riskScore} / 100
                </div>
                <Badge variant={report.riskScore > 70 ? 'critical' : report.riskScore > 40 ? 'warning' : 'success'}>
                  {report.status}
                </Badge>
              </div>

              <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">ABUSEIPDB CONFIDENCE</span>
                <div className="text-3xl font-black text-amber-400">
                  {report.abuseIpdbConfidence}%
                </div>
                <div className="text-[10px] text-slate-400 font-bold">Community Reports</div>
              </div>
            </div>
          </Card>

          {/* Detailed Threat Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card header={
              <h3 className="font-bold text-xl text-slate-100 font-sans flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" /> Malware Family & Vendor Detections
              </h3>
            }>
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">VirusTotal Multi-Vendor Score:</span>
                  <div className="text-lg font-bold text-red-400">{report.virusTotalDetections}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Associated Malware Family:</span>
                  <div className="text-lg font-bold text-amber-300">{report.malwareFamily}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Reputation Summary:</span>
                  <div className="text-xs text-slate-200 mt-1">{report.reputation}</div>
                </div>
              </div>
            </Card>

            <Card header={
              <h3 className="font-bold text-xl text-slate-100 font-sans flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" /> Blacklist Feeds & Known IOC Links
              </h3>
            }>
              <div className="space-y-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Active Blacklists:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {report.blacklists?.length > 0 ? (
                      report.blacklists.map((bl, idx) => (
                        <Badge key={idx} variant="critical" size="md">
                          {bl}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="success" size="md" icon={CheckCircle2}>
                        Not Listed on Major Blacklists
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Known Linked IOC Domains / IP Addresses:</span>
                  <div className="space-y-2">
                    {report.knownIocs?.length > 0 ? (
                      report.knownIocs.map((ioc, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-cyan-300 font-bold">
                          {ioc}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 text-xs">No explicit cross-domain IOC links recorded.</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
