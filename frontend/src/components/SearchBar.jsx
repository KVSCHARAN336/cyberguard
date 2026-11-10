import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Sparkles, Globe } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading, initialValue = '' }) {
  const [domain, setDomain] = useState(initialValue);
  const [inputError, setInputError] = useState('');

  const quickSamples = ['github.com', 'cloudflare.com', 'wordpress.org', 'shopify.com', 'vercel.com'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain.trim()) {
      setInputError('Please enter a target domain name');
      return;
    }
    setInputError('');
    onSearch(domain.trim());
  };

  const handleQuickClick = (sample) => {
    setDomain(sample);
    setInputError('');
    onSearch(sample);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl bg-[#0b1222] border-2 border-cyber-cardBorder focus-within:border-cyber-primary focus-within:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all p-2">
          <div className="pl-4 text-cyber-cyan">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>

          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter target domain (e.g. github.com, cloudflare.com)..."
            disabled={isLoading}
            className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-500 focus:outline-none text-base font-mono"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-cyan text-white font-semibold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Inspect Domain</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {inputError && (
          <p className="mt-2 text-xs text-rose-400 pl-4 font-mono">{inputError}</p>
        )}
      </form>

      {/* Quick launch tags */}
      <div className="mt-3 flex flex-wrap items-center gap-2 px-2 text-xs text-cyber-darkText">
        <span className="flex items-center gap-1 font-semibold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" /> Popular Domains:
        </span>
        {quickSamples.map((sample) => (
          <button
            key={sample}
            onClick={() => handleQuickClick(sample)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-cyber-card/80 border border-cyber-cardBorder hover:border-cyber-primary hover:text-white transition-colors font-mono"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
