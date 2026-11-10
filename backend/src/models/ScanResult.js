const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
  domain: { type: String, required: true, index: true },
  rootDomain: String,
  scannedAt: { type: Date, default: Date.now, index: true },
  scanDurationMs: Number,
  cardSummary: {
    domain: String,
    ip: String,
    hostingProvider: String,
    asn: String,
    country: String,
    countryCode: String,
    organization: String,
    cdn: String,
    server: String,
    cms: String,
    framework: String,
    sslStatus: String,
    sslDaysLeft: Number,
    responseTimeMs: Number
  },
  modules: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('ScanResult', scanResultSchema);
