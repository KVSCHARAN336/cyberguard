import React, { useState } from 'react';
import { Code2, Copy, Check, Play, Terminal, Server } from 'lucide-react';
import api from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState('curl');
  const [copied, setCopied] = useState(false);

  // Live Tester State
  const [testDomain, setTestDomain] = useState('github.com');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const snippets = {
    curl: `curl -X GET "http://localhost:5000/api/scan?domain=github.com" \\
  -H "Accept: application/json"`,

    js: `import axios from 'axios';

const response = await axios.get('http://localhost:5000/api/scan', {
  params: { domain: 'github.com' }
});

console.log(response.data.data.cardSummary);`,

    python: `import requests

response = requests.get('http://localhost:5000/api/scan', params={'domain': 'github.com'})
data = response.json()

print(data['data']['cardSummary'])`
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const runLiveTest = async () => {
    setIsTesting(true);
    try {
      const res = await api.get(`/scan?domain=${encodeURIComponent(testDomain)}`);
      setTestResult(res.data);
    } catch (err) {
      setTestResult({ error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <PageHeader
        badge="DEVELOPER PORTAL"
        title="OpenAPI Specification & Playground"
        subtitle="Integrate domain scanning intelligence into your apps, scripts, and threat intelligence pipelines"
        breadcrumb={['Suite', 'API Docs']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Endpoints List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" /> REST API Endpoints
          </h2>

          {/* 1. GET /api/scan */}
          <Card header={
            <div className="flex items-center gap-2">
              <Badge variant="success">GET</Badge>
              <span className="font-mono text-sm font-bold text-white">/api/scan</span>
            </div>
          }>
            <p className="text-xs text-slate-300 font-mono">Executes parallel 8-microservice inspection for target domain.</p>
            <div className="text-[10px] text-slate-400 font-mono">Query Params: <span className="text-cyan-400 font-bold">domain</span> (required), <span className="text-slate-300">force</span> (optional boolean)</div>
          </Card>

          {/* 2. GET /api/scam-folders */}
          <Card header={
            <div className="flex items-center gap-2">
              <Badge variant="success">GET</Badge>
              <span className="font-mono text-sm font-bold text-white">/api/scam-folders</span>
            </div>
          }>
            <p className="text-xs text-slate-300 font-mono">Returns classified cybercrime scam category folders & aggregated INR (₹) losses.</p>
          </Card>

          {/* 3. GET /api/hosting/abuse-info */}
          <Card header={
            <div className="flex items-center gap-2">
              <Badge variant="success">GET</Badge>
              <span className="font-mono text-sm font-bold text-white">/api/hosting/abuse-info</span>
            </div>
          }>
            <p className="text-xs text-slate-300 font-mono">Resolves official hosting provider abuse contacts & RIR registry profiles.</p>
          </Card>

          {/* 4. GET /api/cases */}
          <Card header={
            <div className="flex items-center gap-2">
              <Badge variant="success">GET</Badge>
              <span className="font-mono text-sm font-bold text-white">/api/cases</span>
            </div>
          }>
            <p className="text-xs text-slate-300 font-mono">Retrieves active FIR complaint records and ingested evidence items.</p>
          </Card>
        </div>

        {/* Live Playground & Code Snippets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" /> Interactive Console & Code Snippets
          </h2>

          <Card hoverable={false}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                {['curl', 'js', 'python'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`h-7 px-3 rounded uppercase font-bold transition-all ${
                      activeTab === t ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={handleCopySnippet}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <code>{snippets[activeTab]}</code>
            </pre>
          </Card>

          {/* Live Playground Console */}
          <Card header={
            <h3 className="font-bold text-xl text-slate-100 font-sans">Live API Playground</h3>
          }>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <Input
                  value={testDomain}
                  onChange={(e) => setTestDomain(e.target.value)}
                  placeholder="domain to test"
                />
                <Button
                  variant="primary"
                  size="md"
                  icon={Play}
                  disabled={isTesting}
                  onClick={runLiveTest}
                  className="shrink-0"
                >
                  {isTesting ? 'Testing...' : 'Execute Request'}
                </Button>
              </div>

              {testResult && (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 max-h-60 overflow-y-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
