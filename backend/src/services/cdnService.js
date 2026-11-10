/**
 * Service 4: CDN Detector Module
 * Identifies Cloudflare, CloudFront, Fastly, Akamai, BunnyCDN, jsDelivr, Vercel, Netlify, etc.
 */
async function detectCdn(dnsData, httpData, ipData) {
  const detectedCdns = [];
  const cnameRecords = (dnsData.CNAME || []).join(' ').toLowerCase();
  const nsRecords = (dnsData.NS || []).join(' ').toLowerCase();
  const headers = httpData.headers || {};
  const serverHeader = (httpData.serverHeader || '').toLowerCase();
  const providerName = (ipData.hostingProvider || '').toLowerCase();
  const orgName = (ipData.organization || '').toLowerCase();

  const cdnRules = [
    {
      name: 'Cloudflare',
      icon: 'cloudflare',
      category: 'CDN & DDoS Protection',
      matched: () =>
        headers['cf-ray'] ||
        headers['cf-cache-status'] ||
        serverHeader.includes('cloudflare') ||
        cnameRecords.includes('cloudflare') ||
        nsRecords.includes('cloudflare') ||
        orgName.includes('cloudflare')
    },
    {
      name: 'Amazon CloudFront',
      icon: 'aws',
      category: 'CDN',
      matched: () =>
        headers['x-amz-cf-id'] ||
        headers['via']?.toLowerCase().includes('cloudfront') ||
        serverHeader.includes('cloudfront') ||
        cnameRecords.includes('cloudfront.net')
    },
    {
      name: 'Fastly',
      icon: 'fastly',
      category: 'CDN',
      matched: () =>
        headers['x-served-by']?.toLowerCase().includes('cache-') ||
        headers['fastly-restarts'] ||
        headers['x-fastly-request-id'] ||
        cnameRecords.includes('fastly.net')
    },
    {
      name: 'Akamai',
      icon: 'akamai',
      category: 'CDN',
      matched: () =>
        headers['x-akamai-transformed'] ||
        headers['x-akamai-request-id'] ||
        serverHeader.includes('akamai') ||
        cnameRecords.includes('edgekey.net') ||
        cnameRecords.includes('akamaiedge.net')
    },
    {
      name: 'BunnyCDN',
      icon: 'bunny',
      category: 'CDN',
      matched: () =>
        headers['server']?.toLowerCase().includes('bunnycdn') ||
        headers['cdn-pullzone'] ||
        cnameRecords.includes('b-cdn.net')
    },
    {
      name: 'jsDelivr',
      icon: 'jsdelivr',
      category: 'Open Source CDN',
      matched: () =>
        cnameRecords.includes('jsdelivr.net') ||
        headers['access-control-allow-origin']?.includes('jsdelivr')
    },
    {
      name: 'Vercel Edge Network',
      icon: 'vercel',
      category: 'Edge & CDN',
      matched: () =>
        headers['x-vercel-id'] ||
        headers['x-vercel-cache'] ||
        serverHeader.includes('vercel') ||
        cnameRecords.includes('vercel-dns.com')
    },
    {
      name: 'Netlify CDN',
      icon: 'netlify',
      category: 'Edge & CDN',
      matched: () =>
        headers['x-nf-request-id'] ||
        serverHeader.includes('netlify') ||
        cnameRecords.includes('netlify.com')
    },
    {
      name: 'Sucuri Firewall',
      icon: 'sucuri',
      category: 'CDN & WAF',
      matched: () =>
        headers['x-sucuri-id'] ||
        headers['x-sucuri-block'] ||
        serverHeader.includes('sucuri')
    }
  ];

  for (const rule of cdnRules) {
    try {
      if (rule.matched()) {
        detectedCdns.push({
          name: rule.name,
          icon: rule.icon,
          category: rule.category,
          detectedVia: 'Header & DNS Analysis'
        });
      }
    } catch (e) {
      // Ignore rule execution errors
    }
  }

  const isProtectedByCdn = detectedCdns.length > 0;
  const primaryCdn = isProtectedByCdn ? detectedCdns[0].name : 'Direct Server / None Detected';

  return {
    isCdnActive: isProtectedByCdn,
    // Kept as an explicit alias for consumers that render this as a proxy shield.
    isShielded: isProtectedByCdn,
    primaryCdn,
    cdnCount: detectedCdns.length,
    cdns: detectedCdns
  };
}

module.exports = { detectCdn };
