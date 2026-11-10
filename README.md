# CyberGuard

CyberGuard is a domain and infrastructure intelligence dashboard for authorized security investigations. It aggregates publicly available DNS, HTTP, TLS, CDN, IP, and RDAP registration data and presents verified reporting contacts for hosting providers and registrars.

## Features

- Parallel domain scans for DNS, HTTP, TLS, IP, CDN, and technology signals.
- Public RDAP ownership and registration data, without bypassing privacy-protected records.
- Hosting-provider, registrar, and ASN abuse-reporting contacts.
- Scan history, comparison, threat-intelligence, case-management, and correlation views.

## Run locally

```bash
npm run install:all
npm start
```

In a second terminal:

```bash
npm run dev:frontend
```

Open `http://localhost:3000`. The backend health endpoint is `http://localhost:5000/api/health`.

See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for configuration, API routes, limitations, and responsible-use guidance.

## Responsible use

Use CyberGuard only for systems and domains you are authorized to investigate. Registrant contact details are displayed only when publicly published through RDAP; privacy-protected data remains unavailable.
