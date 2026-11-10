const axios = require('axios');

/**
 * Service 2: IP Intelligence Module
 * Fetches ASN, Hosting Provider, Organization, Country, Region, City
 */
async function fetchIpIntelligence(ipAddress) {
  if (!ipAddress) {
    return {
      ip: null,
      asn: 'Unknown',
      hostingProvider: 'Unknown',
      organization: 'Unknown',
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      status: 'no_ip'
    };
  }

  try {
    // Attempt fast lookup via ip-api.com
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,hosting,query`, {
      timeout: 3500
    });

    if (response.data && response.data.status === 'success') {
      const d = response.data;
      
      // Infer Hosting Provider cleanly
      let provider = d.isp || d.org || 'Unknown Provider';
      if (d.hosting) {
        provider = `${provider} (Cloud/Hosting)`;
      }

      return {
        ip: d.query || ipAddress,
        asn: d.as || 'N/A',
        hostingProvider: provider,
        organization: d.org || d.isp || 'N/A',
        country: d.country || 'Unknown',
        countryCode: d.countryCode || 'XX',
        region: d.regionName || 'N/A',
        city: d.city || 'N/A',
        latitude: d.lat,
        longitude: d.lon,
        isHosting: !!d.hosting,
        status: 'success'
      };
    }
  } catch (err) {
    // Fallback: try secondary free IP service
    try {
      const fallbackResp = await axios.get(`https://ipapi.co/${ipAddress}/json/`, { timeout: 3000 });
      const f = fallbackResp.data;
      if (f && f.ip) {
        return {
          ip: f.ip,
          asn: f.asn || 'N/A',
          hostingProvider: f.org || f.asn || 'Unknown',
          organization: f.org || 'N/A',
          country: f.country_name || 'Unknown',
          countryCode: f.country_code || 'XX',
          region: f.region || 'N/A',
          city: f.city || 'N/A',
          latitude: f.latitude,
          longitude: f.longitude,
          isHosting: false,
          status: 'success_fallback'
        };
      }
    } catch (fallbackErr) {
      // Return structured fallback
    }
  }

  return {
    ip: ipAddress,
    asn: 'ASN Unresolved',
    hostingProvider: 'Generic Cloud Host',
    organization: 'Network Provider',
    country: 'Global',
    countryCode: 'UN',
    region: 'N/A',
    city: 'N/A',
    status: 'partial'
  };
}

module.exports = { fetchIpIntelligence };
