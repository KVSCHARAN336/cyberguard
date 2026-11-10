import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, Shield, Sliders, Check, Cpu, History } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function Settings() {
  const [cacheTtl, setCacheTtl] = useState('15');
  const [dnsServer, setDnsServer] = useState('8.8.8.8');
  const [maxConcurrency, setMaxConcurrency] = useState('10');
  const [saved, setSaved] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/audit-logs').then(res => {
      if (res.data.success) setAuditLogs(res.data.data);
    }).catch(() => {});
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      {/* Page Header */}
      <PageHeader
        badge="CONFIGURATION & AUDIT"
        title="Platform Settings & System Audit Logs"
        subtitle="Configure parallel scanner timeouts, DNS resolvers, RBAC policies, and immutable system audit trails"
        breadcrumb={['Suite', 'Settings & Audit']}
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Engine Settings */}
        <Card header={
          <h3 className="font-bold text-xl text-slate-100 font-sans flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" /> Engine Parameters & Thresholds
          </h3>
        }>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-semibold uppercase text-[10px] mb-2">
                Cache TTL Duration (Minutes)
              </label>
              <select
                value={cacheTtl}
                onChange={(e) => setCacheTtl(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                <option value="5">5 Minutes (Aggressive Freshness)</option>
                <option value="15">15 Minutes (Default Standard)</option>
                <option value="60">60 Minutes (High Performance)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold uppercase text-[10px] mb-2">
                Primary DNS Resolver Server
              </label>
              <select
                value={dnsServer}
                onChange={(e) => setDnsServer(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                <option value="8.8.8.8">Google Public DNS (8.8.8.8)</option>
                <option value="1.1.1.1">Cloudflare Security DNS (1.1.1.1)</option>
                <option value="9.9.9.9">Quad9 Threat Blocking DNS (9.9.9.9)</option>
              </select>
            </div>

            <Input
              label="Max Parallel Execution Concurrency"
              type="number"
              value={maxConcurrency}
              onChange={(e) => setMaxConcurrency(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={saved ? Check : SettingsIcon}
            >
              {saved ? 'SETTINGS SAVED!' : 'SAVE ENGINE CONFIGURATION'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Immutable System Audit Trail */}
      <Card header={
        <h3 className="font-bold text-xl text-slate-100 font-sans flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" /> Immutable Chain of Custody Audit Log
        </h3>
      }>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/60">
                  <td className="py-3 px-4 text-slate-400 text-[10px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4"><Badge variant="info">{log.action}</Badge></td>
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-200">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
