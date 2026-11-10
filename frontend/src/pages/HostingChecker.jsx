import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ScanningSkeleton from '../components/ScanningSkeleton';
import DashboardCard from '../components/dashboard/DashboardCard';
import DnsRecordsCard from '../components/dashboard/DnsRecordsCard';
import RawHeadersModal from '../components/dashboard/RawHeadersModal';
import HostingAbuseCard from '../components/dashboard/HostingAbuseCard';
import RegistrantOwnerCard from '../components/dashboard/RegistrantOwnerCard';
import MultiReportExportModal from '../components/dashboard/MultiReportExportModal';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { downloadJson, exportPdfReport } from '../utils/exportUtils';
import {
  Globe,
  Server,
  Network,
  Lock,
  Cpu,
  Download,
  FileCode,
  RotateCw,
  Clock,
  ShieldCheck,
  Building,
  MapPin,
  Code,
  Radio,
  Layers,
  Printer
} from 'lucide-react';

export default function HostingChecker({
  scanData,
  isLoading,
  error,
  onSearch,
  currentDomain
}) {
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [showMultiReportModal, setShowMultiReportModal] = useState(false);

  const cardSummary = scanData?.cardSummary;
  const modules = scanData?.modules;
  const edu = scanData?.educationalIntelligence || {};

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <PageHeader
        badge="CYBERGUARD OSINT"
        title="Hosting Checker & Infrastructure Scanner"
        subtitle="Inspect domain infrastructure across all 8 microservices, DNS records matrix, & contact intelligence"
        breadcrumb={['Suite', 'CyberGuard Scanner']}
        actions={
          scanData && !isLoading && (
            <div className="flex items-center gap-2 font-mono">
              <Button
                variant="outline"
                size="sm"
                icon={RotateCw}
                onClick={() => onSearch(currentDomain, true)}
              >
                Re-scan
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={FileCode}
                onClick={() => downloadJson(scanData, `${currentDomain}-scan-report.json`)}
              >
                Export JSON
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={() => setShowMultiReportModal(true)}
              >
                Generate Report Package
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => exportPdfReport(currentDomain)}
              >
                Export PDF
              </Button>
            </div>
          )
        }
      />

      {/* Top Search Controls */}
      <Card hoverable={false}>
        <SearchBar onSearch={(dom) => onSearch(dom, false)} isLoading={isLoading} initialValue={currentDomain} />
      </Card>

      {/* Loading Skeleton */}
      {isLoading && <ScanningSkeleton targetDomain={currentDomain} />}

      {/* Error View */}
      {error && !isLoading && (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center max-w-2xl mx-auto font-mono">
          <h3 className="text-xl font-bold text-rose-400 mb-2">Domain Scan Failed</h3>
          <p className="text-xs text-slate-300 mb-4">{error}</p>
          <Button variant="danger" size="sm" onClick={() => onSearch(currentDomain, true)}>
            Try Again
          </Button>
        </div>
      )}

      {/* Main Dashboard Cards Matrix */}
      {scanData && !isLoading && cardSummary && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* OFFICIAL HOSTING PROVIDER CONTACT INTELLIGENCE PANEL */}
          {modules?.officialReporting && (
            <HostingAbuseCard
              officialReporting={modules.officialReporting}
              domain={scanData.domain}
              ip={cardSummary.ip}
              cardSummary={cardSummary}
            />
          )}

          {/* WEBSITE OWNER & REGISTRANT CONTACT INTELLIGENCE */}
          <RegistrantOwnerCard
            whoisData={modules?.whois}
            ipCrossCheck={modules?.ipCrossCheck}
            domain={scanData.domain}
          />

          {/* Header Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">TARGET DOMAIN INSPECTED</div>
                <h2 className="text-2xl font-black text-white font-sans">{scanData.domain}</h2>
                <div className="text-slate-400 mt-0.5">Root Domain: <span className="text-cyan-400 font-bold">{scanData.rootDomain}</span></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Scan Time:</span>
                <span className="text-emerald-400 font-bold">{scanData.scanDurationMs} ms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Status:</span>
                <Badge variant={scanData.isCached ? 'info' : 'success'}>
                  {scanData.isCached ? 'CACHED RESULT' : 'LIVE FRESH SCAN'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Code}
                onClick={() => setIsHeaderModalOpen(true)}
              >
                Inspect Raw Headers
              </Button>
            </div>
          </div>

          {/* 12 Core Infrastructure Intelligence Cards Grid (With 4-Section Educational Intel) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <DashboardCard
              title="Target Domain"
              value={cardSummary.domain}
              subtitle={`Root: ${scanData.rootDomain}`}
              icon={Globe}
              badge="FQDN Valid"
              badgeType="success"
              source="ICANN WHOIS / RDAP"
              confidence="HIGH"
              simpleExplanation="A domain name is a human-readable address (like github.com) that users type into browsers instead of IP numbers."
              whyItMatters="Domains are the primary entry point for cybercrime victims. Scammers register fake domains mimicking legitimate banks or government portals."
              investigationUsage="Subpoena the domain registrar to obtain subscriber payment records, registrant identity, and login IP address logs."
              knowledgeKey="domain"
              knowledgeData={edu.domain}
            />

            <DashboardCard
              title="Primary IP Address"
              value={cardSummary.ip}
              subtitle="Primary Target IPv4"
              icon={Network}
              badge={cardSummary.ip !== 'Unresolved' ? 'IPv4 Resolved' : 'Failed'}
              badgeType={cardSummary.ip !== 'Unresolved' ? 'success' : 'critical'}
              source="Authoritative DNS Query"
              confidence={cardSummary.ip !== 'Unresolved' ? 'HIGH' : 'LOW'}
              simpleExplanation={`An IP address (like ${cardSummary.ip}) is a numerical identifier assigned to the specific server computer hosting the website.`}
              whyItMatters="Pinpoints the exact hosting provider and physical server location storing the website files and database."
              investigationUsage="Issue preservation notices (CrPC Section 91 / 18 U.S.C. § 2703(f)) to the IP owner to preserve server access logs."
              knowledgeKey="ip"
              knowledgeData={edu.ip}
            />

            <DashboardCard
              title="Hosting Provider"
              value={cardSummary.hostingProvider}
              subtitle="Infrastructure Host"
              icon={Building}
              badge="Verified Host"
              badgeType="info"
              source="RIR Database & Host Directory"
              confidence="HIGH"
              simpleExplanation="A hosting provider is a company that rents out computer servers and internet connections where website files are stored."
              whyItMatters="Hosting providers possess the actual server hard drives, database backups, access logs, and suspect billing details."
              investigationUsage="Submit urgent abuse reports or court preservation orders to the host\'s official abuse portal to suspend the site."
              knowledgeKey="hosting"
              knowledgeData={edu.hosting}
            />

            <DashboardCard
              title="ASN Route"
              value={cardSummary.asn}
              subtitle={cardSummary.organization}
              icon={Radio}
              badge="Autonomous System"
              badgeType="neutral"
              source="BGP Routing Table & RIR"
              confidence="HIGH"
              simpleExplanation="An ASN (Autonomous System Number) is a global identifier for a large network or ISP controlling a block of IP addresses."
              whyItMatters="Identifying the ASN allows investigators to correlate multiple scam websites operating within the same network block."
              investigationUsage="Contact network operators at the Autonomous System level to shut down entire malicious subnets."
              knowledgeKey="asn"
            />

            <DashboardCard
              title="Geo Location"
              value={`${cardSummary.country} (${cardSummary.countryCode})`}
              subtitle={modules?.ipIntelligence?.city ? `${modules.ipIntelligence.city}, ${modules.ipIntelligence.region}` : 'Global Location'}
              icon={MapPin}
              badge="GeoIP Location"
              badgeType="info"
              source="MaxMind GeoIP2 Database"
              confidence="HIGH"
              simpleExplanation="Geo Location identifies the physical country and city where the server IP address is registered."
              whyItMatters="Determines legal jurisdiction for issuing Letters Rogatory, MLAT requests, or international law enforcement cooperation."
              investigationUsage="Route international cybercrime inquiries to foreign CERTs or INTERPOL national central bureaus."
              knowledgeKey="ip"
            />

            <DashboardCard
              title="Network Owner"
              value={cardSummary.organization}
              subtitle="ISP Net Owner"
              icon={Layers}
              badge="Net Owner"
              badgeType="neutral"
              source="ARIN / RIPE / APNIC Registry"
              confidence="HIGH"
              simpleExplanation="The Network Owner is the corporation or ISP that owns the IP address space assigned to the server."
              whyItMatters="Helps identify bulletproof hosting providers or rogue ISPs that ignore abuse notices."
              investigationUsage="Escalate unresolved abuse complaints directly to upper-tier transit providers supplying bandwidth to the network owner."
              knowledgeKey="ip"
            />

            <DashboardCard
              title="CDN Proxy Shield"
              value={cardSummary.cdn}
              subtitle={modules?.cdn?.isCdnActive ? 'DDoS Protection Layer Active' : 'Direct Origin Exposed'}
              icon={ShieldCheck}
              badge={modules?.cdn?.isCdnActive ? 'CDN Active' : 'No Proxy'}
              badgeType={modules?.cdn?.isCdnActive ? 'success' : 'warning'}
              source="HTTP Response Banner & CNAME"
              confidence="HIGH"
              simpleExplanation="A Content Delivery Network (CDN) acts like a proxy shield, hiding the real hosting server\'s true IP address."
              whyItMatters="When a site uses a CDN, standard IP lookups return the CDN proxy address (e.g. Cloudflare) rather than the criminal\'s actual host."
              investigationUsage="File an official law enforcement abuse request with the CDN provider to obtain origin IP disclosures."
              knowledgeKey="cdn"
              knowledgeData={edu.cdn}
            />

            <DashboardCard
              title="Web Server"
              value={cardSummary.server}
              subtitle="HTTP Server Signature"
              icon={Server}
              badge="Server Header"
              badgeType="info"
              source="HTTP Response Headers"
              confidence="HIGH"
              simpleExplanation="Web server software (like Nginx, Apache, or LiteSpeed) processes incoming visitor requests and serves web pages."
              whyItMatters="Reveals server configuration details and potential software vulnerabilities."
              investigationUsage="Match unique web server configuration headers across suspect domains to uncover criminal developer infrastructure."
              knowledgeKey="tech"
              knowledgeData={edu.tech}
            />

            <DashboardCard
              title="CMS Engine"
              value={cardSummary.cms}
              subtitle="Content Management"
              icon={Cpu}
              badge={cardSummary.cms !== 'Custom' ? 'CMS Detected' : 'Custom / Headless'}
              badgeType={cardSummary.cms !== 'Custom' ? 'success' : 'neutral'}
              source="DOM HTML & Meta Tags"
              confidence="HIGH"
              simpleExplanation="A CMS (Content Management System like WordPress or Shopify) is the software used to build and manage the website content."
              whyItMatters="Scammers often deploy automated phishing kits built on WordPress or custom PHP scripts."
              investigationUsage="Identify vulnerable plugins or custom phishing kit URL structures to extract database credentials."
              knowledgeKey="tech"
            />

            <DashboardCard
              title="Frameworks & Libs"
              value={cardSummary.framework}
              subtitle={`Total Detected: ${modules?.technologies?.totalDetected || 0}`}
              icon={Code}
              badge={`${modules?.technologies?.frameworks?.length || 0} Frameworks`}
              badgeType="info"
              source="JavaScript & HTTP Headers"
              confidence="HIGH"
              simpleExplanation="Programming frameworks (like React, Next.js, Laravel, or Vue) used to code the website frontend and backend."
              whyItMatters="Custom script signatures help digital forensic labs match attack methods across different FIR case files."
              investigationUsage="Extract frontend script fingerprints to correlate distinct phishing campaigns operated by the same developer."
              knowledgeKey="tech"
            />

            <DashboardCard
              title="SSL Security"
              value={cardSummary.sslStatus}
              subtitle={modules?.ssl?.daysRemaining !== undefined ? `${modules.ssl.daysRemaining} Days Left` : 'No Validity'}
              icon={Lock}
              badge={modules?.ssl?.isValid ? 'Valid TLS' : 'Invalid/Expired'}
              badgeType={modules?.ssl?.isValid ? 'success' : 'critical'}
              source="X.509 TLS Handshake"
              confidence="HIGH"
              simpleExplanation="An SSL certificate creates an encrypted padlock connection between the visitor\'s browser and the web server."
              whyItMatters="Examining certificate issuance dates and Subject Alternative Names (SANs) reveals other domains registered under the same SSL certificate."
              investigationUsage="Query public Certificate Transparency (CT) logs using the certificate fingerprint to discover newly registered phishing domains."
              knowledgeKey="ssl"
              knowledgeData={edu.ssl}
            />

            <DashboardCard
              title="HTTP Latency"
              value={`${cardSummary.responseTimeMs} ms`}
              subtitle={`Status Code: ${modules?.http?.statusCode || 200}`}
              icon={Clock}
              badge={modules?.http?.statusCode === 200 ? 'HTTP 200 OK' : `HTTP ${modules?.http?.statusCode}`}
              badgeType={modules?.http?.statusCode === 200 ? 'success' : 'warning'}
              source="HTTP GET Response"
              confidence="HIGH"
              simpleExplanation="HTTP response time measures how fast the web server responds to incoming web page requests."
              whyItMatters="Confirms website live availability, server response code, and redirect chains."
              investigationUsage="Document live status and HTTP header redirects to prove the fraudulent site was active at the time of victim loss."
              knowledgeKey="tech"
            />

          </div>

          {/* Filterable DNS Zone Records Matrix (Supports all 12 Record Types) */}
          <DnsRecordsCard dnsModule={modules?.dns} />

        </div>
      )}

      {/* Raw HTTP Headers Modal */}
      {isHeaderModalOpen && (
        <RawHeadersModal
          httpModule={modules?.http}
          domain={scanData?.domain}
          onClose={() => setIsHeaderModalOpen(false)}
        />
      )}

      {/* Multi Format Report Export Modal */}
      {showMultiReportModal && (
        <MultiReportExportModal
          scanData={scanData}
          domain={scanData?.domain}
          onClose={() => setShowMultiReportModal(false)}
        />
      )}

    </div>
  );
}
