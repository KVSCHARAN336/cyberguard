/**
 * Sanitizes input string into clean domain name and protocol URLs
 */
function sanitizeDomain(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Please provide a valid domain name or URL');
  }

  let cleaned = input.trim().toLowerCase();

  // Strip protocol if present
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      const parsed = new URL(cleaned);
      cleaned = parsed.hostname;
    } catch (e) {
      cleaned = cleaned.replace(/^https?:\/\//, '');
    }
  }

  // Remove path, query string, port, and trailing slashes
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  cleaned = cleaned.split('#')[0];
  cleaned = cleaned.split(':')[0];

  // Remove leading 'www.' if present for uniform domain resolution, but retain original for http if needed
  const hostname = cleaned;
  const rootDomain = hostname.replace(/^www\./, '');

  // Domain format validation regex
  const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

  if (!domainRegex.test(hostname) && !domainRegex.test(rootDomain)) {
    throw new Error('Invalid domain format. Example: example.com or github.com');
  }

  return {
    hostname,
    rootDomain,
    urlHttps: `https://${hostname}`,
    urlHttp: `http://${hostname}`
  };
}

module.exports = { sanitizeDomain };
