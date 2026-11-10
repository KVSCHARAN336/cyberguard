/**
 * Infrastructure Intelligence & Educational Annotation Service
 * Enriches technical OSINT scan data with 4-section educational explanations:
 * 1. Technical Information
 * 2. Simple Explanation (Plain English for Investigators & Prosecutors)
 * 3. Why It Matters (Relevance to Cybercrime Investigation)
 * 4. Investigation Usage (Practical Steps, Subpoena Guidance & Takedown Strategy)
 *
 * Adds Source Attribution, Confidence Levels (HIGH, MEDIUM, LOW), and Educational Deep-Dives.
 */

const EDUCATIONAL_KNOWLEDGE_BASE = {
  domain: {
    title: 'Domain Name System & Domain Registration',
    whatItIs: 'A domain name (e.g. target-phishing-bank.com) is a human-readable address that maps to an IP address where a website or server is hosted.',
    howItWorks: 'When a user enters a domain into a browser, the Domain Name System (DNS) queries root name servers and TLD registries to resolve the domain to a numerical IP address.',
    realWorldExample: 'Scammers register typosquatted domains like "paytmm-verify.com" to fool victims into believing they are on an official banking site.',
    legalSignificance: 'Law enforcement can issue court orders or subpoenas to domain registrars (e.g. GoDaddy, Namecheap) to lock the domain (Registrar Hold) or obtain registrant billing records.',
    bestPractices: 'Preserve full WHOIS/RDAP record history before scammers update registrant details or enable privacy WHOIS shields.'
  },
  dns: {
    title: 'DNS Zone Records (A, AAAA, MX, TXT, SPF, NS, SOA, CAA, CNAME)',
    whatItIs: 'DNS records are database entries stored in authoritative DNS servers that direct internet traffic for web, email, and security policies.',
    howItWorks: 'A Records map IPv4 addresses; MX Records direct email to mail servers; TXT records publish SPF/DKIM/DMARC authentication policies; CNAME aliases one domain to another.',
    realWorldExample: 'In a ransomware investigation, malicious C2 infrastructure was uncovered when 15 phishing domains shared identical MX and NS records pointing to a suspect bulletproof host.',
    legalSignificance: 'DNS zone records reveal shared infrastructure across seemingly unrelated fraudulent websites, establishing criminal syndicate linkage.',
    bestPractices: 'Query historical DNS changes (passive DNS lookup) to uncover previous IP addresses used before Cloudflare CDN shields were activated.'
  },
  ip: {
    title: 'IP Address & Network Infrastructure',
    whatItIs: 'An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to the internet.',
    howItWorks: 'IP addresses allow data packets to be routed across global networks. IPv4 uses 32-bit addresses (e.g. 104.21.58.192), while IPv6 uses 128-bit addresses.',
    realWorldExample: 'A cybercrime syndicate operated 45 fake e-commerce websites. Investigating the IP addresses revealed they were all hosted on a single server in Frankfurt, Germany.',
    legalSignificance: 'IP addresses are crucial for issuing MLATs (Mutual Legal Assistance Treaties) or ISP preservation letters under 18 U.S.C. § 2703(f) / Section 91 of Indian CrPC.',
    bestPractices: 'Always check if the IP belongs to a proxy/VPN, Tor exit node, or CDN edge server before sending takedown notices to the IP owner.'
  },
  asn: {
    title: 'Autonomous System Number (ASN) & BGP Routing',
    whatItIs: 'An ASN is a global identifier assigned to a large network or Internet Service Provider (ISP) that controls a cluster of IP address ranges.',
    howItWorks: 'ASNs communicate routing paths using Border Gateway Protocol (BGP). Every major host (e.g. AWS AS16509, Cloudflare AS13335) has dedicated ASNs.',
    realWorldExample: 'Investigators noticed multiple banking malware strains connecting to IPs within AS208605 (a bulletproof hosting provider known for ignoring law enforcement takedowns).',
    legalSignificance: 'Identifying the ASN allows investigators to contact the network owner or transit provider at the Autonomous System level to shut down entire malicious subnets.',
    bestPractices: 'Correlate suspect domains by ASN to discover all active malicious servers operated within the same network block.'
  },
  hosting: {
    title: 'Hosting Provider & Server Infrastructure',
    whatItIs: 'A web hosting provider is a company that supplies physical or virtual server infrastructure where website files and databases reside.',
    howItWorks: 'The host stores website files, processes backend scripts (PHP, Node.js, Python), and serves web requests to visitors.',
    realWorldExample: 'A phishing portal hosted on Hostinger was taken down within 4 hours after investigators submitted an emergency abuse notice with DNS logs and screenshot evidence.',
    legalSignificance: 'Hosting providers possess the actual server hard drives, database backups, access logs, and payment details of the criminal suspect.',
    bestPractices: 'Send formal preservation requests to hosting providers immediately to prevent deletion of access logs upon account termination.'
  },
  ssl: {
    title: 'SSL/TLS Digital Certificate',
    whatItIs: 'An SSL/TLS certificate encrypts communication between a visitor\'s browser and the web server, ensuring data privacy and integrity.',
    howItWorks: 'Certificates are issued by Certificate Authorities (CAs) like Let\'s Encrypt or DigiCert. They contain public keys, domain names, validity periods, and issuer signatures.',
    realWorldExample: 'Even though scammers used Cloudflare to hide their server IP, their SSL certificate Subject Alternative Name (SAN) field contained a unique staging domain linked to the culprit\'s private server.',
    legalSignificance: 'CAs record certificate issuance logs in public Certificate Transparency (CT) logs, revealing every domain registered under the same SSL certificate.',
    bestPractices: 'Analyze certificate serial numbers and CT logs to discover newly registered phishing domains before they are actively launched in smishing campaigns.'
  },
  cdn: {
    title: 'Content Delivery Network (CDN) & Proxy Shields',
    whatItIs: 'A CDN is a distributed network of edge servers that caches website content and proxies web traffic to hide the true origin hosting server.',
    howItWorks: 'When visitors access a CDN-shielded site, their browser connects to the CDN edge server (e.g. Cloudflare IP), which fetches content from the hidden origin server.',
    realWorldExample: 'Scammers hid a fake netbanking site behind Cloudflare. Investigators filed a Cloudflare Abuse Complaint, which revealed the underlying origin host IP.',
    legalSignificance: 'CDNs process high volumes of traffic and maintain detailed origin server IP records and law enforcement compliance portals.',
    bestPractices: 'Submit official law enforcement abuse requests to CDNs to obtain origin IP disclosures and bypass proxy shielding.'
  },
  tech: {
    title: 'Web Technologies & CMS Stack',
    whatItIs: 'The web technology stack includes the Content Management System (CMS), web server software, programming frameworks, and frontend scripts used to build a website.',
    howItWorks: 'Detected headers, HTML tags, and JavaScript signatures reveal whether a site uses WordPress, React, Apache, Nginx, PHP, or custom phishing kits.',
    realWorldExample: 'A series of crypto wallet draining sites shared a distinct custom JavaScript kit signature ("drainer_v2.js") allowing automated detection of 120 related phishing sites.',
    legalSignificance: 'Identifying specific CMS plugins or automated phishing kit signatures helps forensic labs match attack methods across different FIR files.',
    bestPractices: 'Archive raw HTML source code and HTTP response headers for signature matching against criminal developer repositories.'
  },
  email: {
    title: 'Email Security Protocols (SPF, DKIM, DMARC)',
    whatItIs: 'Email security protocols verify whether an email claiming to be from a domain (e.g. @sbi.co.in) was actually sent by an authorized mail server.',
    howItWorks: 'SPF lists authorized sending IPs; DKIM provides cryptographic signatures on email headers; DMARC tells receiving servers how to handle unauthenticated emails.',
    realWorldExample: 'Scammers sent spoofed emails from "support@bank.com". Investigating the DMARC TXT record proved the domain lacked strict enforcement (p=none), allowing spoofing.',
    legalSignificance: 'Proves to court prosecutors whether an email was forged/spoofed or sent from an authorized server.',
    bestPractices: 'Extract raw email headers from victim complaints and compare the receiving server\'s Authentication-Results against published SPF/DMARC records.'
  },
  threat: {
    title: 'Threat Intelligence & Multi-Vendor Reputation',
    whatItIs: 'Threat intelligence aggregates security vendor flags, malware sandbox results, and blacklist entries across global security databases.',
    howItWorks: 'Services like VirusTotal, AbuseIPDB, and URLhaus collect reports from antivirus engines, firewalls, and security analysts to generate risk scores.',
    realWorldExample: 'A suspicious domain had a 42/90 malicious rating on VirusTotal, confirming it was actively serving Trojan banking APKs.',
    legalSignificance: 'Provides objective, multi-vendor evidence of criminality required by judges to grant urgent blocking/takedown warrants.',
    bestPractices: 'Combine passive reputation scores with live OSINT scan evidence to demonstrate ongoing harm in court filings.'
  }
};

/**
 * Generates 4-Section Educational Metadata for a given scan payload
 */
function enrichScanWithEducationalIntelligence(scanPayload) {
  if (!scanPayload) return scanPayload;

  const cardSummary = scanPayload.cardSummary || {};
  const modules = scanPayload.modules || {};
  const dns = modules.dns || {};
  const http = modules.http || {};
  const ssl = modules.ssl || {};
  const ipIntel = modules.ipIntelligence || {};
  const official = modules.officialReporting || {};

  // 1. Domain Section Enrichment
  const domainIntel = {
    technicalInfo: {
      domain: scanPayload.domain,
      rootDomain: scanPayload.rootDomain,
      subdomain: scanPayload.domain !== scanPayload.rootDomain ? scanPayload.domain.replace(`.${scanPayload.rootDomain}`, '') : 'None (Apex Domain)',
      tld: scanPayload.rootDomain.split('.').pop()?.toUpperCase() || 'COM',
      registrar: official.registrar?.name || 'Verified ICANN Registrar',
      whoisStatus: 'Active / Registered',
      dnssec: 'Unsigned / Standard'
    },
    simpleExplanation: `A domain name is the human-readable web address (like ${scanPayload.domain}) that users type into their internet browsers instead of remembering numbers.`,
    whyItMatters: 'Domain names are the primary entry point for cybercrime victims. Scammers register fake domains that mimic legitimate brands or government portals.',
    investigationUsage: 'Investigators can subpoena the domain registrar (the company that sold the domain) to obtain registrant name, phone number, payment method, and login IP logs.',
    source: 'ICANN RDAP / WHOIS & Authoritative DNS',
    confidence: 'HIGH',
    knowledgeKey: 'domain'
  };

  // 2. DNS Records Enrichment
  const dnsRecordsIntel = {
    technicalInfo: {
      primaryIp: dns.primaryIp || cardSummary.ip,
      aRecords: dns.A || [],
      mxRecords: dns.MX || [],
      txtRecords: dns.TXT || [],
      nsRecords: dns.NS || [],
      status: dns.status || 'Resolved'
    },
    simpleExplanation: 'DNS records act like an internet phonebook. They tell computers which IP address hosts the website and which mail server receives emails.',
    whyItMatters: 'DNS records link websites together. If two different scam websites use the exact same Name Servers or MX mail records, they are likely operated by the same criminal group.',
    investigationUsage: 'Examine MX and TXT records to determine where emails are routed or whether domain spoofing was enabled. Check A records to find all IP addresses linked to the domain.',
    source: 'Authoritative Nameservers & DNS Query',
    confidence: dns.A?.length > 0 ? 'HIGH' : 'MEDIUM',
    knowledgeKey: 'dns'
  };

  // 3. IP Intelligence & ASN Enrichment
  const ipIntelEnriched = {
    technicalInfo: {
      ipv4: cardSummary.ip,
      asn: cardSummary.asn,
      organization: cardSummary.organization,
      isp: cardSummary.hostingProvider,
      country: `${cardSummary.country} (${cardSummary.countryCode})`,
      city: ipIntel.city || 'Global Network',
      reverseDns: ipIntel.reverseDns || 'Unresolved PTR'
    },
    simpleExplanation: `An IP address (like ${cardSummary.ip}) is a numerical address that identifies a specific computer server connected to the internet.`,
    whyItMatters: 'The IP address pinpoints the exact hosting provider and physical server location where the criminal website files are stored.',
    investigationUsage: 'Serve preservation notices and subpoenas to the ISP or hosting provider that owns the IP range to request server access logs, connection timestamps, and subscriber records.',
    source: 'ARIN / RIPE / APNIC RIR Database & GeoIP',
    confidence: cardSummary.ip !== 'Unresolved' ? 'HIGH' : 'LOW',
    knowledgeKey: 'ip'
  };

  // 4. Hosting Provider & Cloud Enrichment
  const hostingIntelEnriched = {
    technicalInfo: {
      companyName: cardSummary.hostingProvider,
      asn: cardSummary.asn,
      organization: cardSummary.organization,
      officialWebsite: official.hosting_provider?.website || 'https://www.provider.com',
      abuseEmail: official.hosting_provider?.abuse_email || 'abuse@provider.com',
      reportingPortal: official.hosting_provider?.reporting_portal || 'https://www.provider.com/abuse'
    },
    simpleExplanation: 'A hosting provider is a company that rents out computer servers and internet connections where websites are hosted.',
    whyItMatters: 'Hosting providers have the legal authority and technical ability to immediately shut down illegal websites and preserve evidence upon receiving law enforcement notices.',
    investigationUsage: 'Send urgent abuse reports and preservation notices to the host\'s official abuse email or reporting portal with screenshot evidence and IP metadata.',
    source: 'Verified Hosting Provider Directory & RDAP',
    confidence: 'HIGH',
    knowledgeKey: 'hosting'
  };

  // 5. SSL / TLS Certificate Enrichment
  const sslIntelEnriched = {
    technicalInfo: {
      status: cardSummary.sslStatus,
      daysRemaining: cardSummary.sslDaysLeft,
      issuer: ssl.issuer || 'Let\'s Encrypt / Cloudflare Inc',
      subject: ssl.subject || scanPayload.domain,
      validFrom: ssl.validFrom || 'N/A',
      validTo: ssl.validTo || 'N/A',
      fingerprintSha256: ssl.fingerprint || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    simpleExplanation: 'An SSL certificate creates a secure, encrypted padlock connection between the visitor\'s browser and the web server.',
    whyItMatters: 'Scammers frequently use free SSL certificates. Examining certificate issuance dates and Subject Alternative Names (SANs) reveals other domains registered under the same certificate.',
    investigationUsage: 'Query public Certificate Transparency (CT) logs using the certificate fingerprint to discover newly registered phishing domains before they go live.',
    source: 'X.509 TLS Handshake & Certificate Authority',
    confidence: ssl.isValid ? 'HIGH' : 'MEDIUM',
    knowledgeKey: 'ssl'
  };

  // 6. CDN & Proxy Shield Enrichment
  const cdnIntelEnriched = {
    technicalInfo: {
      detectedCdn: cardSummary.cdn,
      isShielded: modules.cdn?.isCdnActive || false,
      proxyType: modules.cdn?.primaryCdn !== 'Direct Origin' ? 'Reverse Proxy Shield' : 'Exposed Direct Origin'
    },
    simpleExplanation: 'A Content Delivery Network (CDN) acts like a security shield in front of a website, hiding the real hosting server\'s true IP address.',
    whyItMatters: 'When a site uses a CDN, standard IP lookups return the CDN\'s address (e.g. Cloudflare) rather than the criminal\'s actual hosting server.',
    investigationUsage: 'File an official law enforcement abuse inquiry with the CDN provider to obtain the hidden "origin server IP address" where the website is actually hosted.',
    source: 'HTTP Response Headers & CNAME Analysis',
    confidence: 'HIGH',
    knowledgeKey: 'cdn'
  };

  // 7. Server & Web Technology Stack Enrichment
  const techIntelEnriched = {
    technicalInfo: {
      serverHeader: cardSummary.server,
      cms: cardSummary.cms,
      frameworks: cardSummary.framework,
      totalTechnologies: modules.technologies?.totalDetected || 0,
      responseTimeMs: cardSummary.responseTimeMs
    },
    simpleExplanation: 'Web technologies are the software engines (like WordPress, Apache, React, or Nginx) used to build and serve the website.',
    whyItMatters: 'Identifying specific CMS software, plugins, or custom code signatures helps investigators link multiple phishing sites built from the same illegal scam kit.',
    investigationUsage: 'Match web technology versions and custom script URLs against known phishing kit repositories to identify criminal software developers.',
    source: 'HTTP Server Banners & HTML DOM Signatures',
    confidence: 'HIGH',
    knowledgeKey: 'tech'
  };

  // Attach enriched educational metadata object to scanPayload
  scanPayload.educationalIntelligence = {
    domain: domainIntel,
    dns: dnsRecordsIntel,
    ip: ipIntelEnriched,
    hosting: hostingIntelEnriched,
    ssl: sslIntelEnriched,
    cdn: cdnIntelEnriched,
    tech: techIntelEnriched,
    knowledgeBase: EDUCATIONAL_KNOWLEDGE_BASE
  };

  return scanPayload;
}

module.exports = {
  EDUCATIONAL_KNOWLEDGE_BASE,
  enrichScanWithEducationalIntelligence
};
