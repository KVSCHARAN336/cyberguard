const tls = require('tls');

/**
 * Service 6: SSL Module
 * Connects to port 443 via TLS socket and extracts certificate details
 */
async function checkSslCertificate(domainInfo) {
  const { hostname } = domainInfo;

  return new Promise((resolve) => {
    const options = {
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false, // Inspect certificate even if self-signed or custom
      timeout: 5000
    };

    let socket;
    const startTime = Date.now();

    try {
      socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          return resolve({
            isValid: false,
            issuer: 'No Certificate Found',
            subject: 'N/A',
            expiryDate: null,
            daysRemaining: 0,
            tlsVersion: 'N/A',
            status: 'no_ssl'
          });
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
        const isValid = socket.authorized && daysRemaining > 0;

        // Parse Issuer Name
        let issuerName = 'Unknown Issuer';
        if (cert.issuer) {
          issuerName = cert.issuer.O || cert.issuer.CN || cert.issuer.OU || 'Trusted Certificate Authority';
        }

        // Parse Subject Name
        let subjectName = hostname;
        if (cert.subject) {
          subjectName = cert.subject.CN || cert.subject.O || hostname;
        }

        const result = {
          isValid,
          isSelfSigned: cert.issuer?.CN === cert.subject?.CN,
          issuer: issuerName,
          subject: subjectName,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          expiryDate: validTo.toISOString(),
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          tlsVersion: protocol || cipher?.version || 'TLSv1.3',
          cipherName: cipher?.name || 'AES-256-GCM',
          serialNumber: cert.serialNumber || 'N/A',
          fingerprint: cert.fingerprint || 'N/A',
          handshakeTimeMs: Date.now() - startTime,
          status: isValid ? 'valid' : (daysRemaining <= 0 ? 'expired' : 'untrusted')
        };

        socket.destroy();
        resolve(result);
      });

      socket.on('error', (err) => {
        if (socket) socket.destroy();
        resolve({
          isValid: false,
          issuer: 'TLS Connection Failed',
          subject: hostname,
          expiryDate: null,
          daysRemaining: 0,
          tlsVersion: 'N/A',
          error: err.message,
          status: 'error'
        });
      });

      socket.on('timeout', () => {
        if (socket) socket.destroy();
        resolve({
          isValid: false,
          issuer: 'Handshake Timed Out',
          subject: hostname,
          expiryDate: null,
          daysRemaining: 0,
          tlsVersion: 'N/A',
          status: 'timeout'
        });
      });

    } catch (err) {
      if (socket) socket.destroy();
      resolve({
        isValid: false,
        issuer: 'Socket Initialization Error',
        subject: hostname,
        expiryDate: null,
        daysRemaining: 0,
        tlsVersion: 'N/A',
        status: 'error'
      });
    }
  });
}

module.exports = { checkSslCertificate };
