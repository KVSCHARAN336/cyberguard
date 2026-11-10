import React, { useState, useEffect } from 'react';
import { getScanHistory } from '../api/scanApi';
import { History as HistoryIcon, Search, ArrowRight, RefreshCw, Server, Lock, Clock, ExternalLink } from 'lucide-react';

export default function History({ onSelectDomain }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await getScanHistory(query, 30);
      if (res.success) {
        setHistoryList(res.data || []);
      }
    } catch (e) {
      console.error('Failed to load scan history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(searchTerm);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyber-card border border-cyber-cardBorder rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HistoryIcon className="w-5 h-5 text-cyber-cyan" />
            <h2 className="text-xl font-extrabold text-white">Domain Inspection Logs & History</h2>
          </div>
          <p className="text-xs text-cyber-darkText">Recent domain scans cached and saved across platform sessions</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history domains..."
              className="pl-9 pr-4 py-2 text-xs font-mono rounded-xl bg-[#090e1a] border border-cyber-cardBorder text-white focus:outline-none focus:border-cyber-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyber-primary text-white text-xs font-semibold hover:brightness-110 transition-all"
          >
            Filter
          </button>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-cyber-card border border-cyber-cardBorder rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#080d18] text-cyber-darkText text-xs font-mono uppercase tracking-wider border-b border-cyber-cardBorder">
                <th className="py-3.5 px-6">Domain</th>
                <th className="py-3.5 px-4">Hosting Provider</th>
                <th className="py-3.5 px-4">CDN Shield</th>
                <th className="py-3.5 px-4">CMS / Tech</th>
                <th className="py-3.5 px-4">SSL Status</th>
                <th className="py-3.5 px-4">Latency</th>
                <th className="py-3.5 px-4">Scanned Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-cardBorder/40 text-xs font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyber-cyan" />
                    Fetching scan history records...
                  </td>
                </tr>
              ) : historyList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No scan history available yet. Perform a scan in Hosting Checker to populate history.
                  </td>
                </tr>
              ) : (
                historyList.map((item, idx) => {
                  const cs = item.cardSummary || {};
                  return (
                    <tr key={idx} className="hover:bg-cyber-cardBorder/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        <span className="cursor-pointer hover:text-cyber-cyan" onClick={() => onSelectDomain(item.domain)}>
                          {item.domain}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {cs.hostingProvider || 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-cyber-primary/10 text-cyber-cyan border border-cyber-primary/30">
                          {cs.cdn || 'Direct'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {cs.cms || 'Custom'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded ${
                          cs.sslStatus === 'Valid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {cs.sslStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {cs.responseTimeMs ? `${cs.responseTimeMs} ms` : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {new Date(item.scannedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onSelectDomain(item.domain)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyber-primary/20 hover:bg-cyber-primary text-cyber-cyan hover:text-white transition-all text-xs font-semibold"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
