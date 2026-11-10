/**
 * Case Correlation & Entity Relationship Graph Engine
 * Performs multi-case cross-linkage matching identical or overlapping entities
 * (Domains, IPs, ASNs, Phone Numbers, Emails, Wallets, UPI IDs, APK Certs) across complaints.
 */

const { CASES_STORE } = require('./caseService');

function generateCorrelationGraph() {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  function addNode(id, label, type, risk = 30, metadata = {}) {
    if (!nodeMap.has(id)) {
      const nodeObj = { id, label, type, risk, metadata };
      nodeMap.set(id, nodeObj);
      nodes.push(nodeObj);
    }
  }

  function addLink(source, target, relationship, weight = 1) {
    links.push({
      id: `link-${source}-${target}`,
      source,
      target,
      relationship,
      weight
    });
  }

  // Iterate over all cases in store
  CASES_STORE.forEach(c => {
    // Add Case Node with rich metadata
    addNode(c.id, `${c.id} (${c.category})`, 'CASE', c.severity === 'CRITICAL' ? 90 : 60, {
      id: c.id,
      firNumber: c.firNumber,
      title: c.title,
      category: c.category,
      severity: c.severity,
      status: c.status,
      investigator: c.investigator,
      assignedAgency: c.assignedAgency,
      victimName: c.victim.name,
      victimContact: c.victim.contact,
      victimCity: c.victim.city,
      lossAmountFormatted: c.victim.lossAmountFormatted,
      sourceOfIncident: c.sourceOfIncident,
      incidentDateTime: c.incidentDateTime,
      transactionCount: c.transactionCount,
      transactions: c.transactions || []
    });

    // Process Evidence Items
    c.evidence.forEach(ev => {
      let nodeType = 'ENTITY';
      let riskScore = 40;

      if (ev.type.includes('Domain')) { nodeType = 'DOMAIN'; riskScore = 75; }
      else if (ev.type.includes('IP')) { nodeType = 'IP'; riskScore = 80; }
      else if (ev.type.includes('Phone')) { nodeType = 'PHONE'; riskScore = 85; }
      else if (ev.type.includes('Wallet')) { nodeType = 'WALLET'; riskScore = 90; }
      else if (ev.type.includes('Bank') || ev.type.includes('UPI')) { nodeType = 'BANK_UPI'; riskScore = 85; }
      else if (ev.type.includes('APK')) { nodeType = 'APK_CERT'; riskScore = 95; }

      const evNodeId = `NODE-${ev.type.replace(/[^A-Z]/gi, '')}-${ev.value}`;
      addNode(evNodeId, ev.value, nodeType, riskScore, {
        hash: ev.hash,
        source: ev.source,
        addedAt: ev.addedAt
      });

      // Link Case to Evidence Node
      addLink(c.id, evNodeId, 'CONTAINS_EVIDENCE', 2);
    });
  });

  // Cross-Link overlapping evidence across cases
  const entityOccurrences = new Map();
  nodes.forEach(node => {
    if (node.type !== 'CASE') {
      const casesWithEntity = CASES_STORE.filter(c => c.evidence.some(e => e.value === node.label));
      entityOccurrences.set(node.id, casesWithEntity);

      // If entity appears in multiple cases, increase risk score & tag campaign
      if (casesWithEntity.length > 1) {
        node.risk = Math.min(100, node.risk + 20);
        node.isMultiCaseCluster = true;
        node.linkedCaseCount = casesWithEntity.length;
      }
    }
  });

  // Calculate Case-to-Case Correlation Similarity Scores
  const caseCorrelations = [];
  for (let i = 0; i < CASES_STORE.length; i++) {
    for (let j = i + 1; j < CASES_STORE.length; j++) {
      const caseA = CASES_STORE[i];
      const caseB = CASES_STORE[j];

      const evA = caseA.evidence.map(e => e.value);
      const evB = caseB.evidence.map(e => e.value);

      const intersection = evA.filter(val => evB.includes(val));
      if (intersection.length > 0) {
        const similarityScore = Math.round((intersection.length / Math.max(evA.length, evB.length)) * 100);

        caseCorrelations.push({
          caseA: caseA.id,
          caseB: caseB.id,
          commonEntities: intersection,
          similarityScore,
          campaignTag: 'Syndicate Campaign #Alpha-4'
        });

        // Add direct relationship link between cases in Graph
        addLink(caseA.id, caseB.id, `CORRELATED_CASE (${similarityScore}% Match)`, 3);
      }
    }
  }

  return {
    totalNodes: nodes.length,
    totalLinks: links.length,
    nodes,
    links,
    correlatedCampaigns: caseCorrelations
  };
}

module.exports = {
  generateCorrelationGraph
};
