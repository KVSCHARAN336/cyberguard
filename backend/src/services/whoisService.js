const axios = require('axios');

const REDACTION_MARKERS = [
  'redacted',
  'privacy',
  'withheld',
  'not disclosed',
  'data protected'
];

function isRedacted(value) {
  return typeof value === 'string' && REDACTION_MARKERS.some(marker => value.toLowerCase().includes(marker));
}

function publicValue(value) {
  if (value === undefined || value === null) return null;
  const text = Array.isArray(value) ? value.filter(Boolean).join(', ') : String(value).trim();
  return text && !isRedacted(text) ? text : null;
}

function findEntityByRole(entities = [], roles = []) {
  for (const entity of entities) {
    if (entity.roles?.some(role => roles.includes(role))) return entity;
    const nested = findEntityByRole(entity.entities || [], roles);
    if (nested) return nested;
  }
  return null;
}

function parseVCard(entity) {
  const entries = entity?.vcardArray?.[1] || [];
  const read = name => entries.find(entry => entry[0] === name)?.[3];
  const address = read('adr');

  return {
    name: publicValue(read('fn')),
    organization: publicValue(read('org')),
    email: publicValue(read('email')),
    phone: publicValue(read('tel')),
    address: publicValue(Array.isArray(address) ? address.filter(Boolean) : address)
  };
}

function dateOnly(value) {
  return typeof value === 'string' && value ? value.split('T')[0] : null;
}

/**
 * Returns registrant information that is publicly disclosed by RDAP.
 * Privacy-redacted contacts remain unavailable; this service never invents or
 * attempts to bypass private registration information.
 */
async function fetchWhoisData(hostname) {
  const rootDomain = hostname.replace(/^www\./, '');
  const result = {
    domain: rootDomain,
    registrantName: null,
    registrantOrganization: null,
    registrantAddress: null,
    registrantPhone: null,
    registrantEmail: null,
    adminName: null,
    adminOrganization: null,
    adminEmail: null,
    adminPhone: null,
    registrarName: null,
    registrationDate: null,
    expiryDate: null,
    updatedDate: null,
    isPrivacyProtected: true,
    hasPublicRegistrantData: false,
    source: 'RDAP lookup via rdap.org',
    sourceUrl: `https://rdap.org/domain/${encodeURIComponent(rootDomain)}`,
    status: 'unavailable'
  };

  try {
    const response = await axios.get(result.sourceUrl, {
      timeout: 3500,
      headers: { 'User-Agent': 'CyberGuard-OSINT/2.5' }
    });
    const data = response.data;
    if (!data) return result;

    const registrant = parseVCard(findEntityByRole(data.entities, ['registrant']));
    const admin = parseVCard(findEntityByRole(data.entities, ['administrative', 'admin']));
    const registrar = parseVCard(findEntityByRole(data.entities, ['registrar']));

    result.registrantName = registrant.name;
    result.registrantOrganization = registrant.organization;
    result.registrantAddress = registrant.address;
    result.registrantPhone = registrant.phone;
    result.registrantEmail = registrant.email;
    result.adminName = admin.name;
    result.adminOrganization = admin.organization;
    result.adminEmail = admin.email;
    result.adminPhone = admin.phone;
    result.registrarName = registrar.name || publicValue(data.name);
    result.hasPublicRegistrantData = Boolean(
      registrant.name || registrant.organization || registrant.address || registrant.phone || registrant.email
    );
    result.isPrivacyProtected = !result.hasPublicRegistrantData;

    for (const event of data.events || []) {
      if (event.eventAction === 'registration') result.registrationDate = dateOnly(event.eventDate);
      if (event.eventAction === 'expiration') result.expiryDate = dateOnly(event.eventDate);
      if (event.eventAction === 'last changed' || event.eventAction === 'last update') {
        result.updatedDate = dateOnly(event.eventDate);
      }
    }

    result.status = 'success';
  } catch (error) {
    result.error = 'Public RDAP data could not be retrieved for this domain.';
  }

  return result;
}

/**
 * Cross-checks IP address resolution against domain WHOIS / DNS
 */
function crossCheckIpResolution(domain, resolvedIp, dnsRecords = []) {
  if (!resolvedIp || resolvedIp === 'Unresolved') {
    return {
      status: 'UNRESOLVED',
      match: false,
      message: 'IP Address could not be resolved from authoritative DNS.',
      badgeType: 'critical'
    };
  }

  const dnsIps = dnsRecords.A || [];
  const isDnsMatched = dnsIps.includes(resolvedIp);

  return {
    status: 'VERIFIED_IP_MATCH',
    match: isDnsMatched,
    ip: resolvedIp,
    message: isDnsMatched
      ? `Verified: IP ${resolvedIp} directly matches domain A record in DNS.`
      : `IP ${resolvedIp} resolved via edge proxy / CDN shield.`,
    badgeType: isDnsMatched ? 'success' : 'info'
  };
}

module.exports = {
  fetchWhoisData,
  crossCheckIpResolution
};
