import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HostingChecker from './pages/HostingChecker';
import History from './pages/History';
import CompareDomains from './pages/CompareDomains';
import ApiDocs from './pages/ApiDocs';
import Settings from './pages/Settings';
import Cases from './pages/Cases';
import RelationshipGraph from './pages/RelationshipGraph';
import ThreatIntel from './pages/ThreatIntel';
import { scanDomain } from './api/scanApi';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentDomain, setCurrentDomain] = useState('');
  const [scanData, setScanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecuteScan = async (domainToScan, force = false) => {
    if (!domainToScan) return;
    setCurrentDomain(domainToScan);
    setActivePage('checker');
    setIsLoading(true);
    setError(null);

    try {
      const response = await scanDomain(domainToScan, force);
      if (response.success) {
        setScanData(response.data);
      } else {
        setError(response.error || 'Failed to scan domain');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error occurred while scanning domain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryDomain = (domain) => {
    handleExecuteScan(domain, false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans">
      {/* Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'home' && (
          <Home
            onSearchDomain={(dom) => handleExecuteScan(dom, false)}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'cases' && (
          <Cases
            onTriggerScan={(dom) => handleExecuteScan(dom, false)}
          />
        )}

        {activePage === 'checker' && (
          <HostingChecker
            scanData={scanData}
            isLoading={isLoading}
            error={error}
            onSearch={handleExecuteScan}
            currentDomain={currentDomain}
          />
        )}

        {activePage === 'graph' && (
          <RelationshipGraph
            onTriggerScan={(dom) => handleExecuteScan(dom, false)}
          />
        )}

        {activePage === 'threat' && (
          <ThreatIntel />
        )}

        {activePage === 'history' && (
          <History onSelectDomain={handleSelectHistoryDomain} />
        )}

        {activePage === 'compare' && (
          <CompareDomains />
        )}

        {activePage === 'docs' && (
          <ApiDocs />
        )}

        {activePage === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

