# CyberGuard

CyberGuard is a React and Node.js application for gathering publicly available domain, DNS, HTTP, TLS, RDAP, CDN, and technology-fingerprint information. It also includes demo case-management, threat-intelligence, and correlation views for investigation workflows.

## Contents

- [Architecture](#architecture)
- [What a domain scan does](#what-a-domain-scan-does)
- [Requirements and installation](#requirements-and-installation)
- [Configuration](#configuration)
- [Running the application](#running-the-application)
- [API reference](#api-reference)
- [Data and operational limitations](#data-and-operational-limitations)

## Architecture

```text
React + Vite frontend (port 3000 in development)
                 |
                 | /api proxy
                 v
Express API (port 5000 by default)
                 |
     +-----------+------------+--------------------+
     |           |            |                    |
    DNS         HTTP/TLS   RDAP and GeoIP     in-memory/MongoDB
```

The backend is organized as service modules, not independently deployed microservices. The scanner coordinates DNS, HTTP, and TLS requests in parallel, then performs IP intelligence, technology detection, and RDAP lookup using the data returned by the first stage.

## What a domain scan does

`GET` or `POST /api/scan` accepts a hostname or HTTP(S) URL and returns a single aggregated result. A scan may contain:

- DNS records: A, AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC, NS, SOA, CAA, and PTR where available.
- HTTP information: status, final URL, response time, headers, and a redirect list.
- TLS certificate metadata: issuer, subject, validity period, cipher, and negotiated TLS protocol.
- IP intelligence: ASN, organization, approximate geographic data, and hosting-provider information.
- CDN and technology signatures inferred from DNS records, headers, and a bounded HTML response sample.
- RDAP/WHOIS-derived registrant and registrar metadata where it is publicly available.

Registrant names, organisations, addresses, phone numbers, and email addresses are shown only when the relevant RDAP registry publishes them. When registration privacy is enabled or the registry does not provide a value, the application displays that the value is not publicly disclosed and links to the official RDAP record instead.

The result is cached in memory for 15 minutes. A `force=true` request bypasses that cache.

## Requirements and installation

- Node.js 20 or later
- npm
- MongoDB only if persistent scan history is required

From the repository root:

```bash
npm run install:all
```

## Configuration

The backend reads these optional environment variables from `backend/.env` or the process environment:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cyber_hosting_checker
NODE_ENV=development
```

If MongoDB is unavailable, the API remains available and stores scan history in memory for the current process only.

## Running the application

Run the backend from the repository root:

```bash
npm start
```

For auto-restart during backend development:

```bash
npm run dev
```

In another terminal, start the Vite frontend:

```bash
npm run dev:frontend
```

The development URLs are:

- Frontend: `http://localhost:3000`
- API health check: `http://localhost:5000/api/health`
- Scan example: `http://localhost:5000/api/scan?domain=example.com`

Create a production frontend build with:

```bash
npm run build:frontend
```

The build output is static files in `frontend/dist`; serving those files requires a web server or deployment configuration. The Express process does not currently serve the frontend build.

## API reference

All successful API responses include `success: true`. Scan results are under `data`, so the primary IP is available at `response.data.data.cardSummary.ip` in Axios.

| Endpoint | Method | Parameters | Description |
| --- | --- | --- | --- |
| `/api/health` | GET | None | Returns backend availability and version information. |
| `/api/scan` | GET, POST | `domain` required; `force` optional | Runs a domain scan. POST accepts JSON. |
| `/api/history` | GET | `search` optional; `limit` 1-100 | Returns recent scan summaries. |
| `/api/compare` | GET, POST | `domainA`, `domainB` required | Scans two domains and returns comparison metrics. |
| `/api/stats` | GET | None | Returns dashboard summary metrics. |
| `/api/hosting/abuse-info` | GET, POST | `domain`, `ip`, `provider`, `asn`, `org`, `countryCode`, `countryName` optional | Returns matched reporting-contact data. |
| `/api/cases` | GET | `search` optional | Lists demo case records. |
| `/api/cases` | POST | Case JSON body | Adds a case to the in-memory case store. |
| `/api/cases/:id` | GET | Case ID or FIR number | Returns one case. |
| `/api/cases/:id/evidence` | POST | Evidence JSON body | Adds evidence to an in-memory case. |
| `/api/scam-folders` | GET | None | Returns case-category summaries. |
| `/api/threat-intel` | GET | `indicator` optional | Returns the local demonstration reputation report for an indicator. |
| `/api/correlation/graph` | GET | None | Builds an entity graph from the in-memory cases. |
| `/api/audit-logs` | GET | `limit` 1-100 | Returns in-memory case audit events. |

### Scan example

```bash
curl "http://localhost:5000/api/scan?domain=example.com"
```

### Axios example

```js
import axios from 'axios';

const response = await axios.get('http://localhost:5000/api/scan', {
  params: { domain: 'example.com' }
});

console.log(response.data.data.cardSummary);
```

## Data and operational limitations

- DNS, HTTP, TLS, RDAP, and GeoIP data come from external networks. Availability, latency, redirects, rate limits, and privacy protections affect each scan.
- The project does not guarantee a scan duration. The HTTP, TLS, RDAP, and GeoIP services all use timeouts and may return partial results.
- Case records, audit logs, and the threat-intelligence database are local demonstration data held in memory. They are reset when the backend restarts and are not a source of real-time VirusTotal, AbuseIPDB, or other vendor data.
- The Settings screen currently saves controls only in the browser UI; cache TTL, DNS resolver choice, and concurrency are not yet runtime backend configuration.
- MongoDB persists scan results only. It does not persist case records or audit logs.

## Safety and responsible use

Use the scanner only for domains and infrastructure you are authorized to inspect. Public DNS and HTTP data can assist an investigation, but it should be verified before it is used as operational or legal evidence.
