const axios = require('axios');

/**
 * Service 3: HTTP Module
 * Collects HTTP headers, status code, response time, redirects, HTML body
 */
async function inspectHttp(domainInfo) {
  const { urlHttps, urlHttp } = domainInfo;
  
  const result = {
    statusCode: null,
    statusText: '',
    responseTimeMs: 0,
    headers: {},
    rawHeaders: [],
    redirects: [],
    finalUrl: '',
    serverHeader: 'Unknown',
    contentType: '',
    bodySnippet: '',
    isHttps: false,
    status: 'failed'
  };

  const redirectTracker = [];

  const client = axios.create({
    timeout: 6000,
    maxRedirects: 5,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 HostingChecker/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    },
    validateStatus: () => true // Don't throw error on 4xx / 5xx status codes
  });

  // Track redirect chain manually if possible
  client.interceptors.response.use((res) => {
    if (res.request && res.request.res && res.request.res.responseUrl) {
      redirectTracker.push(res.request.res.responseUrl);
    }
    return res;
  });

  const tryFetch = async (targetUrl) => {
    const startTime = Date.now();
    const response = await client.get(targetUrl);
    const duration = Date.now() - startTime;
    return { response, duration };
  };

  try {
    let outcome;
    try {
      outcome = await tryFetch(urlHttps);
      result.isHttps = true;
    } catch (httpsErr) {
      outcome = await tryFetch(urlHttp);
      result.isHttps = false;
    }

    const { response, duration } = outcome;
    
    result.statusCode = response.status;
    result.statusText = response.statusText || `${response.status}`;
    result.responseTimeMs = duration;
    result.headers = response.headers || {};
    
    // Format headers into readable key-value array
    result.rawHeaders = Object.entries(response.headers || {}).map(([key, val]) => ({
      name: key,
      value: Array.isArray(val) ? val.join(', ') : String(val)
    }));

    result.serverHeader = response.headers['server'] || response.headers['x-powered-by'] || 'Unknown';
    result.contentType = response.headers['content-type'] || '';
    result.redirects = redirectTracker.length > 0 ? redirectTracker : [targetUrl];
    result.finalUrl = response.config?.url || targetUrl;

    if (typeof response.data === 'string') {
      result.bodySnippet = response.data.slice(0, 150000); // Sample first 150KB for scanner
    } else if (typeof response.data === 'object') {
      result.bodySnippet = JSON.stringify(response.data);
    }

    result.status = 'success';

  } catch (error) {
    result.status = 'error';
    result.error = error.message;
  }

  return result;
}

module.exports = { inspectHttp };
