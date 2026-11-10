const { TECH_PATTERNS } = require('../utils/techFingerprints');

/**
 * Service 5: Technology Detector Module
 * Scans HTTP headers, HTML body, Meta tags, and Script references
 */
async function detectTechnologies(httpData) {
  const { headers = {}, bodySnippet = '', serverHeader = '' } = httpData;

  const detectedMap = new Map();

  // Helper to safely format header value
  const getHeader = (key) => {
    const val = headers[key.toLowerCase()];
    return Array.isArray(val) ? val.join(' ') : String(val || '');
  };

  // Extract meta tags from HTML body snippet using regex
  const metaTags = [];
  const metaRegex = /<meta\s+name=["']([^"']+)["']\s+content=["']([^"']+)["']/gi;
  let match;
  while ((match = metaRegex.exec(bodySnippet)) !== null) {
    metaTags.push({ name: match[1].toLowerCase(), content: match[2] });
  }

  for (const pattern of TECH_PATTERNS) {
    let matched = false;
    let matchReason = '';

    // Check Headers
    if (pattern.rules.headers) {
      for (const hRule of pattern.rules.headers) {
        const headerVal = getHeader(hRule.key);
        if (headerVal && hRule.regex.test(headerVal)) {
          matched = true;
          matchReason = `Header '${hRule.key}' matching signature`;
          break;
        }
      }
    }

    // Check Body regex
    if (!matched && pattern.rules.body) {
      for (const bRegex of pattern.rules.body) {
        if (bRegex.test(bodySnippet)) {
          matched = true;
          matchReason = `HTML source code signature`;
          break;
        }
      }
    }

    // Check Meta tags
    if (!matched && pattern.rules.meta) {
      for (const mRule of pattern.rules.meta) {
        const foundMeta = metaTags.find(m => m.name === mRule.name);
        if (foundMeta && mRule.regex.test(foundMeta.content)) {
          matched = true;
          matchReason = `Meta tag '${mRule.name}'`;
          break;
        }
      }
    }

    if (matched) {
      detectedMap.set(pattern.name, {
        name: pattern.name,
        category: pattern.category,
        icon: pattern.icon,
        confidence: pattern.confidence,
        detectedVia: matchReason
      });
    }
  }

  // Detect Web Server Technology
  let serverTech = serverHeader || 'Unknown Server';
  if (serverHeader.toLowerCase().includes('nginx')) serverTech = 'NGINX';
  else if (serverHeader.toLowerCase().includes('apache')) serverTech = 'Apache HTTP Server';
  else if (serverHeader.toLowerCase().includes('litespeed')) serverTech = 'LiteSpeed Web Server';
  else if (serverHeader.toLowerCase().includes('caddy')) serverTech = 'Caddy Server';
  else if (serverHeader.toLowerCase().includes('cloudflare')) serverTech = 'Cloudflare Server';

  const detectedList = Array.from(detectedMap.values());

  // Categorize for quick dashboard mapping
  const cms = detectedList.filter(t => t.category === 'CMS');
  const frameworks = detectedList.filter(t => t.category === 'Framework');
  const languages = detectedList.filter(t => t.category === 'Language');
  const ui = detectedList.filter(t => t.category === 'UI Framework');

  return {
    totalDetected: detectedList.length,
    cms: cms.length > 0 ? cms[0].name : 'Custom / Headless',
    cmsList: cms,
    frameworks: frameworks.map(f => f.name),
    frameworkList: frameworks,
    languages: languages.map(l => l.name),
    server: serverTech,
    technologies: detectedList
  };
}

module.exports = { detectTechnologies };
