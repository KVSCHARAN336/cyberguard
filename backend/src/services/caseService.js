/**
 * Case & Complaint Management Service
 * Manages FIRs, Victim Profiles, Multimodal Evidence Vault, Timelines, Audit Logs,
 * and automatic Scam Category Classification with detailed Transaction Records (Strictly in INR ₹).
 */

const crypto = require('crypto');

// Defined Cybercrime Scam Folders & Classifications
const SCAM_FOLDERS = [
  {
    id: 'banking-phishing',
    name: 'Banking & Phishing Scams',
    icon: 'Landmark',
    description: 'Fake netbanking portals, KYC update smishing, APK trojans, and credential harvesters.',
    categoryKeys: ['Phishing Scam', 'Banking Fraud', 'KYC Fraud']
  },
  {
    id: 'investment-job',
    name: 'Investment & Task Fraud',
    icon: 'TrendingUp',
    description: 'Part-time Telegram task scams, fake stock trading apps, and guaranteed return schemes.',
    categoryKeys: ['Financial Fraud', 'Investment Fraud', 'Job Scam']
  },
  {
    id: 'digital-arrest',
    name: 'Digital Arrest & Impersonation',
    icon: 'ShieldAlert',
    description: 'Fake CBI/ED/Telecom officer video calls, illegal parcel intimidation, and extortion.',
    categoryKeys: ['Digital Arrest', 'Impersonation Fraud', 'Extortion']
  },
  {
    id: 'ransomware-extortion',
    name: 'Ransomware & Infrastructure Malware',
    icon: 'Lock',
    description: 'Hospital & enterprise system encryption, C2 server malware, and LockBit ransomware.',
    categoryKeys: ['Ransomware', 'Malware Outbreak', 'C2 Infrastructure']
  },
  {
    id: 'upi-crypto',
    name: 'UPI & Crypto Asset Fraud',
    icon: 'Coins',
    description: 'Fraudulent UPI QR money collectors, P2P crypto money laundering, and wallet drains.',
    categoryKeys: ['Crypto Fraud', 'UPI Fraud', 'Payment Gateway Scam']
  },
  {
    id: 'ecommerce-delivery',
    name: 'E-Commerce & Delivery Scams',
    icon: 'ShoppingBag',
    description: 'Fake online shopping portals, fake courier delivery fee traps, and lottery fraud.',
    categoryKeys: ['Illegal Hosting', 'E-Commerce Scam', 'Customs Fraud']
  }
];

// Pre-seeded Forensic Cybercrime Cases (All figures strictly in INR ₹)
const CASES_STORE = [
  {
    id: 'CASE-2026-8891',
    firNumber: 'FIR/2026/CYBER/0491',
    title: 'Multi-State Phishing Campaign targeting Netbanking Credentials',
    category: 'Phishing Scam',
    folderId: 'banking-phishing',
    severity: 'CRITICAL',
    status: 'Active',
    investigator: 'Insp. Vikram Rathore',
    assignedAgency: 'Cyber Crime Police Station - Cell 1',
    sourceOfIncident: 'Smishing SMS Link ("hsb-banking-secure-auth.com")',
    incidentDateTime: '01 Aug 2026, 09:30 AM IST',
    transactionCount: 2,
    victim: {
      name: 'Rameshwar Sharma',
      age: 48,
      contact: '+91 98765 43210',
      lossAmountInr: 3750000,
      lossAmountFormatted: '₹37,50,000 (₹37.5 Lakhs)',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    transactions: [
      {
        txnId: 'TXN99281748102',
        amountInr: 1500000,
        formattedAmount: '₹15,00,000',
        mode: 'IMPS Netbanking Transfer',
        beneficiary: 'fraudster.pay@okaxis (Axis Bank)',
        dateTime: '01 Aug 2026, 09:45 AM IST'
      },
      {
        txnId: 'TXN88392019482',
        amountInr: 2250000,
        formattedAmount: '₹22,50,000',
        mode: 'RTGS Bank Transfer',
        beneficiary: 'Mule Account #9988771122 (SBI Branch)',
        dateTime: '01 Aug 2026, 10:15 AM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-101',
        type: 'Domain / URL',
        value: 'hsb-banking-secure-auth.com',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        addedAt: '2026-08-01T10:15:00Z',
        source: 'Victim SMS Screenshot'
      },
      {
        id: 'EV-102',
        type: 'IP Address',
        value: '104.21.58.192',
        hash: '8f4e21c97a8e1039b56f890123456789abcdef0123456789abcdef0123456789',
        addedAt: '2026-08-01T10:20:00Z',
        source: 'DNS Resolution'
      },
      {
        id: 'EV-103',
        type: 'Phone Number',
        value: '+91 91234 56789',
        hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        addedAt: '2026-08-01T11:00:00Z',
        source: 'Smishing SMS Sender'
      },
      {
        id: 'EV-104',
        type: 'UPI / Bank Account',
        value: 'fraudster.pay@okaxis',
        hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
        addedAt: '2026-08-01T11:30:00Z',
        source: 'Victim Bank Statement'
      }
    ],
    timeline: [
      { date: '2026-08-01T09:30:00Z', event: 'FIR Registered at Cyber Cell Station', actor: 'Duty Officer' },
      { date: '2026-08-01T10:15:00Z', event: 'Ingested domain evidence: hsb-banking-secure-auth.com', actor: 'Insp. Vikram Rathore' },
      { date: '2026-08-01T12:00:00Z', event: 'CyberGuard OSINT scan initiated on target domain', actor: 'Automated System' }
    ],
    notes: 'Fake bank login portal collecting netbanking credentials and OTPs via smishing links.',
    createdAt: '2026-08-01T09:30:00Z'
  },
  {
    id: 'CASE-2026-7742',
    firNumber: 'FIR/2026/DELHI/0198',
    title: 'Fake Job Portal & YouTube Task Investment Scam',
    category: 'Investment Fraud',
    folderId: 'investment-job',
    severity: 'HIGH',
    status: 'Under Analysis',
    investigator: 'Sub-Insp. Ananya Verma',
    assignedAgency: 'Special Cell - Cyber Crime Unit',
    sourceOfIncident: 'Telegram Channel ("@GlobalCareersJobs")',
    incidentDateTime: '28 Jul 2026, 02:00 PM IST',
    transactionCount: 3,
    victim: {
      name: 'Priyanka Sen',
      age: 29,
      contact: '+91 99887 76655',
      lossAmountInr: 1040000,
      lossAmountFormatted: '₹10,40,000 (₹10.4 Lakhs)',
      city: 'New Delhi',
      state: 'Delhi'
    },
    transactions: [
      {
        txnId: 'UPI773820194',
        amountInr: 40000,
        formattedAmount: '₹40,000',
        mode: 'UPI Deposit',
        beneficiary: 'taskrecruiter@ybl',
        dateTime: '28 Jul 2026, 02:30 PM IST'
      },
      {
        txnId: 'UPI773890211',
        amountInr: 300000,
        formattedAmount: '₹3,00,000',
        mode: 'IMPS Transfer',
        beneficiary: 'Mule Account #4433221100',
        dateTime: '28 Jul 2026, 04:15 PM IST'
      },
      {
        txnId: 'UPI774019283',
        amountInr: 700000,
        formattedAmount: '₹7,00,000',
        mode: 'NEFT Transfer',
        beneficiary: 'Cryptocurrency P2P Escrow',
        dateTime: '29 Jul 2026, 11:00 AM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-201',
        type: 'Domain / URL',
        value: 'global-careers-verify.online',
        hash: 'b10a8db164e0754105b7a99be72e3fe5',
        addedAt: '2026-07-28T14:00:00Z',
        source: 'Victim Telegram Group Link'
      },
      {
        id: 'EV-202',
        type: 'Phone Number',
        value: '+91 91234 56789',
        hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        addedAt: '2026-07-29T10:00:00Z',
        source: 'Telegram Recruiter Handle'
      }
    ],
    timeline: [
      { date: '2026-07-28T13:00:00Z', event: 'FIR Registered', actor: 'Duty Officer' }
    ],
    notes: 'Victim lured into fake YouTube video like/rate task group, then coerced into prepaid investment tiers.',
    createdAt: '2026-07-28T13:00:00Z'
  },
  {
    id: 'CASE-2026-9104',
    firNumber: 'FIR/2026/KA/0843',
    title: 'Hospital Operations Shutdown & LockBit Ransomware Extortion',
    category: 'Ransomware',
    folderId: 'ransomware-extortion',
    severity: 'CRITICAL',
    status: 'Active',
    investigator: 'Dr. K. Srinivas (Forensic Director)',
    assignedAgency: 'CERT-State Forensic Science Laboratory',
    sourceOfIncident: 'Phishing Email Vector & C2 Malware Binary',
    incidentDateTime: '04 Aug 2026, 07:45 AM IST',
    transactionCount: 1,
    victim: {
      name: 'Apex HealthCare Multispecialty Hospital',
      age: 0,
      contact: 'admin@apexhealthcare.org',
      lossAmountInr: 12500000,
      lossAmountFormatted: '₹1,25,000,000 (₹12.5 Crores Ransom Demand)',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    transactions: [
      {
        txnId: 'RANSOM-DEMAND-BTC-15',
        amountInr: 12500000,
        formattedAmount: '₹12.5 Crores (15 BTC)',
        mode: 'Bitcoin Blockchain Demand',
        beneficiary: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        dateTime: '04 Aug 2026, 08:00 AM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-301',
        type: 'Domain / URL',
        value: 'apex-portal-update.org',
        hash: 'c4ca4238a0b923820dcc509a6f75849b',
        addedAt: '2026-08-04T08:00:00Z',
        source: 'C2 Server Log'
      },
      {
        id: 'EV-302',
        type: 'Crypto Wallet',
        value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        hash: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
        addedAt: '2026-08-04T08:30:00Z',
        source: 'Ransomware Note Text'
      }
    ],
    timeline: [
      { date: '2026-08-04T07:45:00Z', event: 'Emergency CERT Incident Incident Escalation', actor: 'Hospital IT Admin' }
    ],
    notes: 'Hospital server encrypted by LockBit 3.0 binary. Demand of 15 BTC sent via ransom note.',
    createdAt: '2026-08-04T07:45:00Z'
  },
  {
    id: 'CASE-2026-6219',
    firNumber: 'FIR/2026/MH/1102',
    title: 'Fake Police / Telecom Department "Digital Arrest" Extortion',
    category: 'Digital Arrest',
    folderId: 'digital-arrest',
    severity: 'CRITICAL',
    status: 'Active',
    investigator: 'Insp. Rajesh Kadam',
    assignedAgency: 'Cyber Crime Police Station - Bandra',
    sourceOfIncident: 'WhatsApp Video Call Impersonating IPS Officer',
    incidentDateTime: '02 Aug 2026, 03:00 PM IST',
    transactionCount: 2,
    victim: {
      name: 'Sunita Deshmukh (Senior Citizen)',
      age: 65,
      contact: '+91 97654 32109',
      lossAmountInr: 8200000,
      lossAmountFormatted: '₹82,00,000 (₹82 Lakhs)',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    transactions: [
      {
        txnId: 'RTGS998827164',
        amountInr: 5000000,
        formattedAmount: '₹50,00,000',
        mode: 'RTGS Safe Custody Transfer',
        beneficiary: 'cbi.verification@sbi (Mule Account)',
        dateTime: '02 Aug 2026, 04:30 PM IST'
      },
      {
        txnId: 'RTGS998827551',
        amountInr: 3200000,
        formattedAmount: '₹32,00,000',
        mode: 'RTGS Bank Transfer',
        beneficiary: 'Mule Account #8811223344',
        dateTime: '02 Aug 2026, 06:15 PM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-401',
        type: 'Phone Number',
        value: '+91 88776 54321',
        hash: 'aa11bb22cc33dd44ee55ff667788990011223344556677889900112233445566',
        addedAt: '2026-08-02T16:00:00Z',
        source: 'WhatsApp Video Call Record'
      },
      {
        id: 'EV-402',
        type: 'UPI / Bank Account',
        value: 'cbi.verification@sbi',
        hash: 'bb22cc33dd44ee55ff6677889900112233445566778899001122334455667788',
        addedAt: '2026-08-02T17:30:00Z',
        source: 'RTGS Money Transfer Slip'
      }
    ],
    timeline: [
      { date: '2026-08-02T15:00:00Z', event: 'Victim targeted via fake Skype video call impersonating IPS Officer', actor: 'Scammer' }
    ],
    notes: 'Scammers placed victim under 36-hour fake video call "digital arrest" alleging illegal parcel containing narcotics.',
    createdAt: '2026-08-02T15:00:00Z'
  },
  {
    id: 'CASE-2026-5301',
    firNumber: 'FIR/2026/TN/0412',
    title: 'Fraudulent UPI QR Code Merchant Payment Draining',
    category: 'UPI Fraud',
    folderId: 'upi-crypto',
    severity: 'MEDIUM',
    status: 'Active',
    investigator: 'Sub-Insp. S. Murugan',
    assignedAgency: 'Chennai Cyber Cell',
    sourceOfIncident: 'Tampered Physical QR Sticker Overlay at Counter',
    incidentDateTime: '03 Aug 2026, 10:30 AM IST',
    transactionCount: 5,
    victim: {
      name: 'K. Balaji (Electronics Retailer)',
      age: 41,
      contact: '+91 94440 12345',
      lossAmountInr: 450000,
      lossAmountFormatted: '₹4,50,000 (₹4.5 Lakhs)',
      city: 'Chennai',
      state: 'Tamil Nadu'
    },
    transactions: [
      {
        txnId: 'UPI-STORE-001',
        amountInr: 150000,
        formattedAmount: '₹1,50,000',
        mode: 'GPay UPI Auto-Collect',
        beneficiary: 'paytm.merchant99@paytm',
        dateTime: '03 Aug 2026, 10:45 AM IST'
      },
      {
        txnId: 'UPI-STORE-002',
        amountInr: 300000,
        formattedAmount: '₹3,00,000',
        mode: 'PhonePe UPI QR Transfer',
        beneficiary: 'paytm.merchant99@paytm',
        dateTime: '03 Aug 2026, 11:15 AM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-501',
        type: 'UPI / Bank Account',
        value: 'paytm.merchant99@paytm',
        hash: 'cc33dd44ee55ff66778899001122334455667788990011223344556677889900',
        addedAt: '2026-08-03T11:00:00Z',
        source: 'Merchant QR Code Sticker Overlay'
      }
    ],
    timeline: [
      { date: '2026-08-03T10:30:00Z', event: 'Physical QR code sticker tampered at store counter', actor: 'Unknown Suspect' }
    ],
    notes: 'Tampered merchant QR sticker redirected store payments to fraudster UPI account.',
    createdAt: '2026-08-03T10:30:00Z'
  },
  {
    id: 'CASE-2026-4190',
    firNumber: 'FIR/2026/GJ/0754',
    title: 'Fake Customs Clearance & Courier Delivery Trap Scam',
    category: 'E-Commerce Scam',
    folderId: 'ecommerce-delivery',
    severity: 'MEDIUM',
    status: 'Under Analysis',
    investigator: 'Insp. Chirag Patel',
    assignedAgency: 'Ahmedabad Cyber Crime Unit',
    sourceOfIncident: 'Phishing Email Link ("customs-express-clearance.in")',
    incidentDateTime: '05 Aug 2026, 08:30 AM IST',
    transactionCount: 1,
    victim: {
      name: 'Mehta Traders Pvt Ltd',
      age: 0,
      contact: 'customs@mehtatraders.in',
      lossAmountInr: 1850000,
      lossAmountFormatted: '₹18,50,000 (₹18.5 Lakhs)',
      city: 'Ahmedabad',
      state: 'Gujarat'
    },
    transactions: [
      {
        txnId: 'TXN-CUSTOMS-9912',
        amountInr: 1850000,
        formattedAmount: '₹18,50,000',
        mode: 'Credit Card Payment Gateway',
        beneficiary: 'Customs Clearance Gate Ltd',
        dateTime: '05 Aug 2026, 09:15 AM IST'
      }
    ],
    evidence: [
      {
        id: 'EV-601',
        type: 'Domain / URL',
        value: 'customs-express-clearance.in',
        hash: 'dd44ee55ff667788990011223344556677889900112233445566778899001122',
        addedAt: '2026-08-05T09:00:00Z',
        source: 'Phishing Email Link'
      }
    ],
    timeline: [
      { date: '2026-08-05T08:30:00Z', event: 'Phishing email received regarding stuck international courier', actor: 'Phishing Operator' }
    ],
    notes: 'Fake customs portal demanding non-existent duty clearance fees.',
    createdAt: '2026-08-05T08:30:00Z'
  }
];

// Audit Log Store
const AUDIT_LOGS = [
  { id: 'LOG-1', timestamp: new Date().toISOString(), action: 'System Initialization', actor: 'SYSTEM', detail: 'Polyglot Persistence & Case Linkage Engine Started (INR Currency & Transaction Logs Enforced)' }
];

function getAllCases(search = '') {
  if (!search) return CASES_STORE;
  const q = search.toLowerCase();
  return CASES_STORE.filter(c => 
    c.id.toLowerCase().includes(q) ||
    c.firNumber.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.investigator.toLowerCase().includes(q) ||
    c.victim.name.toLowerCase().includes(q) ||
    c.evidence.some(e => e.value.toLowerCase().includes(q))
  );
}

function getScamCategoryFolders() {
  return SCAM_FOLDERS.map(folder => {
    const matchingCases = CASES_STORE.filter(c => 
      c.folderId === folder.id || 
      folder.categoryKeys.some(key => c.category.toLowerCase().includes(key.toLowerCase()))
    );

    const totalLossInr = matchingCases.reduce((sum, c) => sum + (c.victim?.lossAmountInr || 0), 0);
    const criticalCount = matchingCases.filter(c => c.severity === 'CRITICAL').length;

    const formattedLoss = totalLossInr >= 10000000
      ? `₹${(totalLossInr / 10000000).toFixed(2)} Crores`
      : totalLossInr >= 100000
      ? `₹${(totalLossInr / 100000).toFixed(1)} Lakhs`
      : `₹${totalLossInr.toLocaleString('en-IN')}`;

    return {
      ...folder,
      caseCount: matchingCases.length,
      totalLossInr,
      totalLossFormatted: formattedLoss,
      criticalCount,
      cases: matchingCases
    };
  });
}

function getCaseById(id) {
  return CASES_STORE.find(c => c.id === id || c.firNumber === id);
}

function createCase(caseData) {
  const newId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const firNumber = caseData.firNumber || `FIR/2026/CYBER/${Math.floor(100 + Math.random() * 900)}`;
  
  const rawLossNum = parseInt(String(caseData.victimLoss || '').replace(/[^0-9]/g, ''), 10) || 500000;
  const formattedLossStr = rawLossNum >= 10000000
    ? `₹${(rawLossNum / 10000000).toFixed(2)} Crores`
    : rawLossNum >= 100000
    ? `₹${(rawLossNum / 100000).toFixed(1)} Lakhs`
    : `₹${rawLossNum.toLocaleString('en-IN')}`;

  const matchedFolder = SCAM_FOLDERS.find(f => 
    f.categoryKeys.some(k => (caseData.category || '').toLowerCase().includes(k.toLowerCase()))
  ) || SCAM_FOLDERS[0];

  const createdCase = {
    id: newId,
    firNumber: firNumber,
    title: caseData.title || 'Untitled Cybercrime Incident',
    category: caseData.category || 'Phishing Scam',
    folderId: matchedFolder.id,
    severity: caseData.severity || 'HIGH',
    status: caseData.status || 'Active',
    investigator: caseData.investigator || 'Insp. Vikram Rathore',
    assignedAgency: caseData.assignedAgency || 'Cyber Crime Police Station',
    sourceOfIncident: caseData.sourceOfIncident || 'Online Victim Complaint',
    incidentDateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    transactionCount: 1,
    victim: {
      name: caseData.victimName || caseData.victim?.name || 'Anonymous Victim',
      contact: caseData.victimContact || caseData.victim?.contact || '+91 98765 00000',
      lossAmountInr: rawLossNum,
      lossAmountFormatted: formattedLossStr,
      city: caseData.victimCity || 'India'
    },
    transactions: [
      {
        txnId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
        amountInr: rawLossNum,
        formattedAmount: formattedLossStr,
        mode: 'Online Payment Transfer',
        beneficiary: 'Unverified Mule Account',
        dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    ],
    evidence: caseData.evidence || [],
    timeline: [
      { date: new Date().toISOString(), event: `FIR ${firNumber} created in UCIP Vault`, actor: caseData.investigator || 'Investigator' }
    ],
    notes: caseData.notes || '',
    createdAt: new Date().toISOString()
  };

  CASES_STORE.unshift(createdCase);

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'CREATE_CASE',
    actor: caseData.investigator || 'System User',
    detail: `Created Case ${newId} (${firNumber}) under ${matchedFolder.name} - ${createdCase.title}`
  });

  return createdCase;
}

function addEvidenceToCase(caseId, evidenceItem) {
  const targetCase = getCaseById(caseId);
  if (!targetCase) return null;

  const value = evidenceItem.value;
  const hash = evidenceItem.hash || crypto.createHash('sha256').update(value).digest('hex');

  const newEv = {
    id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
    type: evidenceItem.type || 'Generic Evidence',
    value: value,
    hash: hash,
    addedAt: new Date().toISOString(),
    source: evidenceItem.source || 'Investigator Input'
  };

  targetCase.evidence.push(newEv);
  targetCase.timeline.push({
    date: new Date().toISOString(),
    event: `Attached ${newEv.type} evidence: ${newEv.value}`,
    actor: evidenceItem.addedBy || 'Investigator'
  });

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'ADD_EVIDENCE',
    actor: evidenceItem.addedBy || 'Investigator',
    detail: `Attached ${newEv.type} (${newEv.value}) to ${caseId}`
  });

  return newEv;
}

function getAuditLogs(limit = 50) {
  return AUDIT_LOGS.slice(0, limit);
}

module.exports = {
  CASES_STORE,
  SCAM_FOLDERS,
  getAllCases,
  getScamCategoryFolders,
  getCaseById,
  createCase,
  addEvidenceToCase,
  getAuditLogs
};
