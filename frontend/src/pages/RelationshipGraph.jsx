import React, { useState, useEffect } from 'react';
import { Network, Filter, RefreshCw, AlertTriangle, Share2, CreditCard, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function RelationshipGraph({ onTriggerScan }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/correlation/graph');
      if (res.data.success) {
        setGraphData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch correlation graph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const nodes = graphData?.nodes || [];
  const links = graphData?.links || [];
  const campaigns = graphData?.correlatedCampaigns || [];

  const filteredNodes = filterType === 'ALL'
    ? nodes
    : nodes.filter(n => n.type === filterType || (filterType === 'MULTI' && n.isMultiCaseCluster));

  const meta = selectedNode?.metadata || {};

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        badge="CORRELATION ENGINE"
        title="Multi-Case Entity Relationship Graph"
        subtitle="Cross-linking Shared IPs, Domains, Phone Numbers, Crypto Wallets, and APK Hashes across FIRs"
        breadcrumb={['Suite', 'Relationship Graph']}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            disabled={loading}
            onClick={fetchGraph}
          >
            {loading ? 'RE-CALCULATING...' : 'RE-CALCULATE GRAPH'}
          </Button>
        }
      />

      {/* Control Filters */}
      <Card hoverable={false} className="py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Nodes:</span>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'MULTI', 'CASE', 'DOMAIN', 'IP', 'PHONE', 'WALLET'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`h-8 px-3 rounded-lg font-bold transition-all ${
                    filterType === t
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {t === 'MULTI' ? '⚡ MULTI-CASE CLUSTERS' : t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Mapped Entities:</span>
            <Badge variant="info">{nodes.length} Nodes</Badge>
            <Badge variant="warning">{links.length} Links</Badge>
          </div>
        </div>
      </Card>

      {/* Correlated Campaigns Banner */}
      {campaigns.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <AlertTriangle className="w-4 h-4" /> AUTOMATED FRAUD CAMPAIGN CLUSTER DETECTED:
          </div>
          {campaigns.map((camp, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-slate-300">
              <div>
                <span className="text-amber-300 font-bold">{camp.campaignTag}:</span> Linked <span className="text-cyan-400 font-bold">{camp.caseA}</span> & <span className="text-cyan-400 font-bold">{camp.caseB}</span> via shared IOC ({camp.commonEntities.join(', ')})
              </div>
              <Badge variant="success">
                {camp.similarityScore}% MATCH
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Visual Graph View & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Interactive Node Matrix Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[550px] flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 mb-4 font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <span>ENTITY CORRELATION MATRIX</span>
            <span className="text-cyan-400">CLICK ANY NODE TO INSPECT</span>
          </div>

          <div className="my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs space-y-2 relative overflow-hidden ${
                  selectedNode?.id === node.id
                    ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/50 shadow-xl'
                    : node.isMultiCaseCluster
                    ? 'bg-slate-950 border-amber-500/50 hover:border-amber-400'
                    : node.type === 'CASE'
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-600'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-cyan-500/50'
                }`}
              >
                {node.isMultiCaseCluster && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-bl">
                    SHARED IOC
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Badge variant={
                    node.type === 'CASE' ? 'info' :
                    node.type === 'DOMAIN' ? 'info' :
                    node.type === 'IP' ? 'neutral' :
                    node.type === 'PHONE' ? 'warning' : 'neutral'
                  } size="sm">
                    {node.type}
                  </Badge>
                  <span className={`text-[10px] font-bold ${node.risk > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {node.risk}% RISK
                  </span>
                </div>

                <div className="font-bold text-slate-100 truncate text-xs font-sans">{node.label}</div>

                {node.linkedCaseCount && (
                  <div className="text-[10px] text-amber-300 font-semibold">
                    Linked to {node.linkedCaseCount} active FIRs
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-[10px] text-center border-t border-slate-800/80 pt-3">
            Click any node card to inspect simple details & trigger OSINT scans.
          </div>
        </div>

        {/* Selected Node Inspector Panel (SIMPLE & CLEAN) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs text-slate-200 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white font-sans border-b border-slate-800 pb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" /> Case & Entity Summary
            </h3>

            {selectedNode ? (
              <div className="space-y-4">
                
                {/* Node Basic Badge Card */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                  <div className="text-sm font-bold text-cyan-300 font-sans truncate">{selectedNode.label}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Type: <Badge variant="info" size="sm">{selectedNode.type}</Badge></span>
                    <Badge variant={selectedNode.risk > 70 ? 'critical' : 'success'} size="sm">{selectedNode.risk}% RISK</Badge>
                  </div>
                </div>

                {/* SIMPLE CASE SUMMARY IF CASE NODE IS SELECTED */}
                {selectedNode.type === 'CASE' && meta && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-cyan-400 font-bold font-mono text-sm">{meta.firNumber}</span>
                      <Badge variant="warning" size="sm">{meta.severity}</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">💰 Amount Lost (INR ₹):</span>
                        <span className="text-emerald-400 font-black text-sm">{meta.lossAmountFormatted || '₹37,50,000'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">📍 Source of Incident:</span>
                        <span className="text-slate-200 font-semibold">{meta.sourceOfIncident || 'Online Victim Complaint'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">🗓️ Incident Date & Time:</span>
                        <span className="text-amber-300 font-semibold">{meta.incidentDateTime || '01 Aug 2026, 09:30 AM'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">👤 Victim & Officer:</span>
                        <span className="text-slate-200 font-semibold">{meta.victimName} ({meta.victimCity}) | {meta.investigator}</span>
                      </div>
                    </div>

                    {/* Simple Transactions List */}
                    {meta.transactions && meta.transactions.length > 0 && (
                      <div className="border-t border-slate-800 pt-2 space-y-1.5">
                        <span className="text-slate-400 font-bold font-mono text-[11px] block">
                          💳 Transactions ({meta.transactions.length}):
                        </span>
                        <div className="space-y-1.5 font-mono text-[11px]">
                          {meta.transactions.map((tx, idx) => (
                            <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                              <span className="text-emerald-400 font-bold">{tx.formattedAmount} ({tx.mode})</span>
                              <span className="text-cyan-300 font-semibold truncate max-w-[120px]">{tx.beneficiary}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === 'DOMAIN' && (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onTriggerScan && onTriggerScan(selectedNode.label)}
                  >
                    TRIGGER OSINT SCAN
                  </Button>
                )}

                <div className="space-y-1.5 font-mono text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Connected Links:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map(l => (
                      <div key={l.id} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] flex justify-between">
                        <span className="text-cyan-400 font-bold">{l.relationship}</span>
                        <span className="text-slate-400">{l.source === selectedNode.id ? l.target : l.source}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs font-mono">
                Click any Case or Entity node to view simple details & transactions.
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 text-center">
            Graph Correlation Engine v2.5
          </div>
        </div>

      </div>
    </div>
  );
}
