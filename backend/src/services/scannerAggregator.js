const { sanitizeDomain } = require('../utils/domainSanitizer');
const { resolveDns } = require('./dnsService');
const { fetchIpIntelligence } = require('./ipService');
const { inspectHttp } = require('./httpService');
const { detectCdn } = require('./cdnService');
const { detectTechnologies } = require('./techService');
const { checkSslCertificate } = require('./sslService');
const { resolveOfficialReportingAndContactIntelligence } = require('./hostingAbuseService');
const { enrichScanWithEducationalIntelligence } = require('./infrastructureIntelService');
const { fetchWhoisData, crossCheckIpResolution } = require('./whoisService');
const ScanResult = require('../models/ScanResult');
const { getIsConnected } = require('../config/db');

// In-Memory Cache Fallback
const memoryCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes

/**
 * Result Aggregator Module
 * Coordinates all independent microservices in parallel
 */
async function scanDomain(rawInput, forceRefresh = false) {
  const domainInfo = sanitizeDomain(rawInput);
  const { hostname } = domainInfo;
  const startTime = Date.now();

  // Check In-Memory Cache
  if (!forceRefresh && memoryCache.has(hostname)) {
    const cached = memoryCache.get(hostname);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { ...cached.data, isCached: true };
    }
  }

  // Check MongoDB Cache if DB connected
  if (!forceRefresh && getIsConnected()) {
    try {
      const dbResult = await ScanResult.findOne({ domain: hostname });
      if (dbResult && (Date.now() - new Date(dbResult.scannedAt).getTime() < CACHE_TTL_MS)) {
        const formatted = dbResult.toObject();
        memoryCache.set(hostname, { timestamp: Date.now(), data: formatted });
        return { ...formatted, isCached: true };
      }
    } catch (e) {
      console.warn('MongoDB cache lookup warning:', e.message);
    }
  }

  // Step 1: Run DNS, HTTP, and SSL in parallel first
  const [dnsSettled, httpSettled, sslSettled] = await Promise.allSettled([
    resolveDns(domainInfo),
    inspectHttp(domainInfo),
    checkSslCertificate(domainInfo)
  ]);

  const dnsData = dnsSettled.status === 'fulfilled' ? dnsSettled.value : { A: [], status: 'failed' };
  const httpData = httpSettled.status === 'fulfilled' ? httpSettled.value : { statusCode: 500, status: 'failed' };
  const sslData = sslSettled.status === 'fulfilled' ? sslSettled.value : { isValid: false, status: 'failed' };

  // Determine Primary IP from DNS
  const primaryIp = dnsData.primaryIp || null;

  // Step 2: Run IP Intelligence, Tech Detection, and WHOIS in parallel
  const [ipSettled, techSettled, whoisSettled] = await Promise.allSettled([
    fetchIpIntelligence(primaryIp),
    detectTechnologies(httpData),
    fetchWhoisData(hostname)
  ]);

  const ipData = ipSettled.status === 'fulfilled' ? ipSettled.value : { ip: primaryIp, hostingProvider: 'Unknown' };
  const techData = techSettled.status === 'fulfilled' ? techSettled.value : { totalDetected: 0, technologies: [] };
  const whoisData = whoisSettled.status === 'fulfilled' ? whoisSettled.value : { registrantName: 'REDACTED FOR PRIVACY' };

  // Step 3: CDN Detection & IP Cross Check
  const cdnData = await detectCdn(dnsData, httpData, ipData);
  const ipCrossCheck = crossCheckIpResolution(hostname, ipData.ip, dnsData);

  // Step 4: Resolve Official Reporting & Contact Intelligence
  const officialReporting = resolveOfficialReportingAndContactIntelligence({
    domain: hostname,
    ip: ipData.ip,
    asn: ipData.asn,
    hostingProvider: ipData.hostingProvider,
    organization: ipData.organization,
    countryCode: ipData.countryCode,
    countryName: ipData.country
  });

  const totalScanTimeMs = Date.now() - startTime;

  // Unified Aggregated Payload
  const scanPayload = {
    domain: hostname,
    rootDomain: domainInfo.rootDomain,
    scannedAt: new Date().toISOString(),
    scanDurationMs: totalScanTimeMs,
    isCached: false,

    // Core Dashboard Cards Data
    cardSummary: {
      domain: hostname,
      ip: ipData.ip || 'Unresolved',
      hostingProvider: ipData.hostingProvider || 'Unknown Host',
      asn: ipData.asn || 'N/A',
      country: ipData.country || 'Global',
      countryCode: ipData.countryCode || 'XX',
      organization: ipData.organization || 'N/A',
      cdn: cdnData.primaryCdn,
      server: techData.server || httpData.serverHeader || 'Unknown',
      cms: techData.cms || 'Custom',
      framework: techData.frameworks.length > 0 ? techData.frameworks.join(', ') : 'Vanilla / Static',
      sslStatus: sslData.isValid ? 'Valid' : (sslData.daysRemaining === 0 ? 'Invalid/Expired' : 'No SSL'),
      sslDaysLeft: sslData.daysRemaining,
      responseTimeMs: httpData.responseTimeMs
    },

    // Detailed Module Payloads
    modules: {
      dns: dnsData,
      ipIntelligence: ipData,
      whois: whoisData,
      ipCrossCheck: ipCrossCheck,
      http: {
        statusCode: httpData.statusCode,
        statusText: httpData.statusText,
        responseTimeMs: httpData.responseTimeMs,
        serverHeader: httpData.serverHeader,
        contentType: httpData.contentType,
        isHttps: httpData.isHttps,
        finalUrl: httpData.finalUrl,
        redirects: httpData.redirects,
        rawHeaders: httpData.rawHeaders
      },
      cdn: cdnData,
      technologies: techData,
      ssl: sslData,
      officialReporting: officialReporting
    }
  };

  // Enrich Payload with 4-Section Educational & Legal Investigation Intelligence
  enrichScanWithEducationalIntelligence(scanPayload);

  // Cache in Memory
  memoryCache.set(hostname, { timestamp: Date.now(), data: scanPayload });

  // Save to MongoDB if available
  if (getIsConnected()) {
    try {
      await ScanResult.findOneAndUpdate(
        { domain: hostname },
        scanPayload,
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('MongoDB save warning:', e.message);
    }
  }

  return scanPayload;
}

module.exports = { scanDomain };
