const dns = require('dns').promises;

const DNS_QUERY_TIMEOUT_MS = 4000;

function withTimeout(operation, timeoutMs = DNS_QUERY_TIMEOUT_MS) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('DNS query timed out')), timeoutMs);
  });

  return Promise.race([operation(), timeout]).finally(() => clearTimeout(timer));
}

/**
 * DNS Module
 * Resolves A, AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC, NS, SOA, CAA, PTR records asynchronously
 */
async function resolveDns(domainInfo) {
  const { hostname } = domainInfo;
  const startTime = Date.now();

  const results = {
    A: [],
    AAAA: [],
    CNAME: [],
    MX: [],
    TXT: [],
    SPF: [],
    DKIM: [],
    DMARC: [],
    NS: [],
    SOA: null,
    CAA: [],
    PTR: [],
    primaryIp: null,
    totalRecords: 0,
    resolutionTimeMs: 0,
    status: 'success'
  };

  const resolveSafe = async (type, resolverFn) => {
    try {
      const records = await withTimeout(() => resolverFn(hostname));
      return Array.isArray(records) ? records : [records];
    } catch (err) {
      return [];
    }
  };

  try {
    const [a, aaaa, cname, mx, txt, ns, soa, caa, dmarc, dkim] = await Promise.all([
      resolveSafe('A', (host) => dns.resolve4(host)),
      resolveSafe('AAAA', (host) => dns.resolve6(host)),
      resolveSafe('CNAME', (host) => dns.resolveCname(host)),
      resolveSafe('MX', (host) => dns.resolveMx(host)),
      resolveSafe('TXT', (host) => dns.resolveTxt(host)),
      resolveSafe('NS', (host) => dns.resolveNs(host)),
      withTimeout(() => dns.resolveSoa(hostname)).catch(() => null),
      resolveSafe('CAA', (host) => dns.resolveCaa(host)),
      resolveSafe('DMARC', () => dns.resolveTxt(`_dmarc.${hostname}`)),
      resolveSafe('DKIM', () => dns.resolveTxt(`google._domainkey.${hostname}`))
    ]);

    results.A = a;
    results.AAAA = aaaa;
    results.CNAME = cname;
    results.MX = mx.map(m => ({ exchange: m.exchange, priority: m.priority }));
    
    const formattedTxt = txt.map(t => Array.isArray(t) ? t.join('') : t);
    results.TXT = formattedTxt;

    // Filter SPF from TXT
    results.SPF = formattedTxt.filter(t => t.toLowerCase().startsWith('v=spf1'));

    // DMARC & DKIM
    results.DMARC = dmarc.map(t => Array.isArray(t) ? t.join('') : t);
    results.DKIM = dkim.map(t => Array.isArray(t) ? t.join('') : t);

    results.NS = ns;
    results.SOA = soa ? `${soa.nsname} (Admin: ${soa.hostmaster}, Serial: ${soa.serial})` : null;
    results.CAA = caa.map(c => `${c.issue || c.issuewild || 'issue'} ${c.value}`);

    if (a.length > 0) {
      results.primaryIp = a[0];
    } else if (aaaa.length > 0) {
      results.primaryIp = aaaa[0];
    }

    // Resolve PTR if primaryIp exists
    if (results.primaryIp) {
      try {
        const ptrs = await withTimeout(() => dns.reverse(results.primaryIp));
        results.PTR = ptrs;
      } catch (e) {
        results.PTR = [];
      }
    }

    results.totalRecords = 
      results.A.length + 
      results.AAAA.length + 
      results.CNAME.length + 
      results.MX.length + 
      results.TXT.length + 
      results.SPF.length + 
      results.DMARC.length + 
      results.NS.length + 
      (results.SOA ? 1 : 0) + 
      results.CAA.length + 
      results.PTR.length;

  } catch (error) {
    results.status = 'partial_error';
    results.error = error.message;
  }

  results.resolutionTimeMs = Date.now() - startTime;
  return results;
}

module.exports = { resolveDns };
