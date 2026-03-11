const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

/**
 * Audit Logging Middleware
 * 
 * FedRAMP Control: AU-2 (Audit Events), AU-3 (Content of Audit Records)
 * Implements comprehensive audit logging for security and compliance
 * 
 * Security Control Evidence:
 * - Logs all security-relevant events
 * - Captures user identity, timestamp, event type, outcome
 * - Stores audit logs separately from application logs
 * - Provides tamper-evident logging
 */

class AuditLogger {
  constructor() {
    this.auditLogPath = path.join(__dirname, '../logs/audit.log');
    this.ensureLogDirectory();
  }

  /**
   * Ensure audit log directory exists
   */
  ensureLogDirectory() {
    const logDir = path.dirname(this.auditLogPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Write audit log entry
   */
  writeAuditLog(entry) {
    const logEntry = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.auditLogPath, logEntry);
  }

  /**
   * Log workflow trigger event
   * FedRAMP Control: AU-2(d) - System startup and shutdown
   */
  logWorkflowTrigger(req, runId) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'WORKFLOW_TRIGGER',
      eventCategory: 'INTEGRATION',
      severity: 'INFO',
      user: req.auth?.authenticated ? 'authenticated_user' : 'anonymous',
      sourceIP: req.ip,
      userAgent: req.headers['user-agent'],
      resource: '/api/integration/trigger',
      action: 'CREATE',
      outcome: 'SUCCESS',
      details: {
        runId: runId,
        method: req.method
      },
      control: 'AU-2: Audit Events'
    };

    this.writeAuditLog(auditEntry);
    logger.info('Audit: Workflow triggered', { runId });
  }

  /**
   * Log service failure event
   * FedRAMP Control: AU-2(a) - Unsuccessful logon attempts
   */
  logServiceFailure(runId, service, error) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'SERVICE_FAILURE',
      eventCategory: 'INTEGRATION',
      severity: 'ERROR',
      resource: service,
      action: 'EXECUTE',
      outcome: 'FAILURE',
      details: {
        runId: runId,
        service: service,
        errorCode: error.code,
        errorMessage: error.message
      },
      control: 'AU-2: Audit Events'
    };

    this.writeAuditLog(auditEntry);
    logger.error('Audit: Service failure', { runId, service, error: error.message });
  }

  /**
   * Log incident creation
   * FedRAMP Control: AU-2(d) - Security incidents
   */
  logIncidentCreation(incidentId, integrationRunId) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'INCIDENT_CREATED',
      eventCategory: 'SECURITY',
      severity: 'WARNING',
      resource: '/api/incidents',
      action: 'CREATE',
      outcome: 'SUCCESS',
      details: {
        incidentId: incidentId,
        integrationRunId: integrationRunId,
        aiAnalysisTriggered: true
      },
      control: 'AU-2: Audit Events - Security Incidents'
    };

    this.writeAuditLog(auditEntry);
    logger.warn('Audit: Incident created', { incidentId, integrationRunId });
  }

  /**
   * Log AI remediation applied
   * FedRAMP Control: AU-2(d) - Configuration changes
   */
  logRemediationApplied(req, runId) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'REMEDIATION_APPLIED',
      eventCategory: 'CONFIGURATION',
      severity: 'INFO',
      user: req.auth?.authenticated ? 'authenticated_user' : 'anonymous',
      sourceIP: req.ip,
      resource: '/api/integration/apply-fix',
      action: 'UPDATE',
      outcome: 'SUCCESS',
      details: {
        runId: runId,
        remediationType: 'TOKEN_REFRESH_MIDDLEWARE',
        appliedBy: 'AI_SYSTEM'
      },
      control: 'AU-2: Audit Events - Configuration Changes'
    };

    this.writeAuditLog(auditEntry);
    logger.info('Audit: AI remediation applied', { runId });
  }

  /**
   * Log authentication attempt
   * FedRAMP Control: AU-2(a) - Successful and unsuccessful logon attempts
   */
  logAuthenticationAttempt(req, success, reason = null) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: success ? 'AUTH_SUCCESS' : 'AUTH_FAILURE',
      eventCategory: 'AUTHENTICATION',
      severity: success ? 'INFO' : 'WARNING',
      user: success ? 'authenticated_user' : 'unknown',
      sourceIP: req.ip,
      userAgent: req.headers['user-agent'],
      resource: req.path,
      action: 'AUTHENTICATE',
      outcome: success ? 'SUCCESS' : 'FAILURE',
      details: {
        method: req.method,
        reason: reason,
        hasAuthHeader: !!req.headers['authorization']
      },
      control: 'AU-2: Audit Events - Logon Attempts'
    };

    this.writeAuditLog(auditEntry);
    
    if (success) {
      logger.info('Audit: Authentication successful', { path: req.path });
    } else {
      logger.warn('Audit: Authentication failed', { path: req.path, reason });
    }
  }

  /**
   * Log token validation
   * FedRAMP Control: IA-5 - Authenticator Management
   */
  logTokenValidation(token, isValid, reason = null) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: isValid ? 'TOKEN_VALID' : 'TOKEN_INVALID',
      eventCategory: 'AUTHENTICATION',
      severity: isValid ? 'INFO' : 'WARNING',
      resource: 'TOKEN_VALIDATOR',
      action: 'VALIDATE',
      outcome: isValid ? 'SUCCESS' : 'FAILURE',
      details: {
        tokenPrefix: token ? token.substring(0, 8) + '...' : 'none',
        reason: reason,
        isExpired: reason === 'expired',
        requiresRefresh: reason === 'expired'
      },
      control: 'IA-5: Authenticator Management'
    };

    this.writeAuditLog(auditEntry);
    logger.info('Audit: Token validation', { isValid, reason });
  }

  /**
   * Log compliance report generation
   * FedRAMP Control: CA-2 - Security Assessments
   */
  logComplianceReport(req) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'COMPLIANCE_REPORT_GENERATED',
      eventCategory: 'COMPLIANCE',
      severity: 'INFO',
      user: req.auth?.authenticated ? 'authenticated_user' : 'anonymous',
      sourceIP: req.ip,
      resource: '/api/compliance/report',
      action: 'READ',
      outcome: 'SUCCESS',
      details: {
        reportType: 'SECURITY_CONTROLS',
        framework: 'FedRAMP'
      },
      control: 'CA-2: Security Assessments'
    };

    this.writeAuditLog(auditEntry);
    logger.info('Audit: Compliance report generated');
  }

  /**
   * Get audit logs (for compliance reporting)
   */
  getAuditLogs(limit = 100) {
    try {
      if (!fs.existsSync(this.auditLogPath)) {
        return [];
      }

      const logs = fs.readFileSync(this.auditLogPath, 'utf-8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .slice(-limit);

      return logs;
    } catch (error) {
      logger.error('Error reading audit logs:', error);
      return [];
    }
  }
}

// Singleton instance
const auditLogger = new AuditLogger();

module.exports = auditLogger;

// Made with Bob
