const express = require('express');
const router = express.Router();
const {
  handleScan,
  handleHistory,
  handleCompare,
  handleStats,
  handleHostingAbuse,
  handleGetCases,
  handleGetScamFolders,
  handleGetCaseById,
  handleCreateCase,
  handleAddEvidence,
  handleThreatIntel,
  handleCorrelationGraph,
  handleAuditLogs
} = require('../controllers/scanController');

// CyberGuard Scan Domain endpoint
router.get('/scan', handleScan);
router.post('/scan', handleScan);

// History & Search endpoint
router.get('/history', handleHistory);

// Compare Domains endpoint
router.get('/compare', handleCompare);
router.post('/compare', handleCompare);

// Platform Stats endpoint
router.get('/stats', handleStats);

// NEW MODULE: Hosting Abuse Contact Lookup
router.get('/hosting/abuse-info', handleHostingAbuse);
router.post('/hosting/abuse-info', handleHostingAbuse);

// NEW MODULE: Case & Complaint Management & Scam Folders
router.get('/cases', handleGetCases);
router.get('/scam-folders', handleGetScamFolders);
router.post('/cases', handleCreateCase);
router.get('/cases/:id', handleGetCaseById);
router.post('/cases/:id/evidence', handleAddEvidence);

// NEW MODULE: Threat Intelligence Aggregator
router.get('/threat-intel', handleThreatIntel);

// NEW MODULE: Case Correlation Graph Engine
router.get('/correlation/graph', handleCorrelationGraph);

// NEW MODULE: Audit Logs Inspection
router.get('/audit-logs', handleAuditLogs);

module.exports = router;


