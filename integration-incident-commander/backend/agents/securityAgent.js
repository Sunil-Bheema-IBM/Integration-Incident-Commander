const logger = require('../utils/logger');

/**
 * Security Agent
 * Responsible for security and compliance analysis
 */
class SecurityAgent {
  constructor() {
    this.name = 'SecurityAgent';
    this.role = 'Security';
  }

  /**
   * Analyze security and compliance implications
   */
  async analyze(incident, previousAnalysis) {
    logger.info(`${this.name}: Analyzing security implications for incident ${incident.id}`);

    const { devAnalysis, archAnalysis } = previousAnalysis;
    const failedService = devAnalysis.analysis.technicalDetails.service;
    const errorCode = devAnalysis.analysis.technicalDetails.errorCode;

    // Assess security severity
    const severity = this.assessSecuritySeverity(errorCode, failedService);
    
    // Check compliance issues
    const complianceIssues = this.checkComplianceIssues(incident, devAnalysis);
    
    // Analyze data exposure risk
    const dataExposure = this.analyzeDataExposure(incident, failedService);
    
    // Generate security recommendations
    const recommendations = this.generateSecurityRecommendations(
      severity,
      complianceIssues,
      dataExposure
    );

    return {
      agent: this.name,
      severity: severity.level,
      securityScore: this.calculateSecurityScore(severity, complianceIssues, dataExposure),
      complianceIssues: complianceIssues,
      dataExposure: dataExposure,
      recommendations: recommendations,
      confidence: 85,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Assess security severity
   */
  assessSecuritySeverity(errorCode, failedService) {
    let severity = {
      level: 'low',
      score: 2,
      description: 'Minor security concern'
    };

    if (errorCode === 401) {
      severity = {
        level: 'high',
        score: 8,
        description: 'Authentication failure - potential credential compromise or misconfiguration',
        concerns: [
          'Expired credentials may indicate lack of proper token management',
          'Authentication failures can lead to service disruption',
          'May expose authentication endpoints to brute force attacks'
        ]
      };
    } else if (errorCode === 403) {
      severity = {
        level: 'medium',
        score: 6,
        description: 'Authorization failure - potential privilege escalation attempt',
        concerns: [
          'Improper access controls',
          'Potential unauthorized access attempts'
        ]
      };
    } else if (errorCode === 500) {
      severity = {
        level: 'medium',
        score: 5,
        description: 'Server error - may expose sensitive information in error messages',
        concerns: [
          'Error messages may leak system information',
          'Unhandled exceptions could expose stack traces'
        ]
      };
    }

    return severity;
  }

  /**
   * Check compliance issues
   */
  checkComplianceIssues(incident, devAnalysis) {
    const issues = [];

    // Check PCI DSS compliance (for payment services)
    if (devAnalysis.analysis.technicalDetails.service === 'PaymentService') {
      issues.push({
        standard: 'PCI DSS',
        requirement: '8.2.4 - Change user passwords/passphrases at least once every 90 days',
        status: 'FAIL',
        severity: 'high',
        finding: 'OAuth token expired after 24 hours without automatic refresh',
        remediation: 'Implement automatic token refresh mechanism',
        reference: 'PCI DSS v3.2.1 Requirement 8.2.4'
      });

      issues.push({
        standard: 'PCI DSS',
        requirement: '10.2 - Implement automated audit trails',
        status: 'PASS',
        severity: 'info',
        finding: 'Authentication failures are being logged',
        reference: 'PCI DSS v3.2.1 Requirement 10.2'
      });
    }

    // Check SOC 2 compliance
    issues.push({
      standard: 'SOC 2',
      requirement: 'CC6.1 - Logical and Physical Access Controls',
      status: 'FAIL',
      severity: 'medium',
      finding: 'Authentication token management lacks proper controls',
      remediation: 'Implement token lifecycle management with automatic refresh',
      reference: 'SOC 2 Trust Services Criteria CC6.1'
    });

    // Check GDPR compliance
    issues.push({
      standard: 'GDPR',
      requirement: 'Article 32 - Security of Processing',
      status: 'WARNING',
      severity: 'medium',
      finding: 'Service disruption may affect data availability',
      remediation: 'Implement high availability and disaster recovery procedures',
      reference: 'GDPR Article 32'
    });

    // Check logging compliance
    issues.push({
      standard: 'General Security',
      requirement: 'Security Event Logging',
      status: 'PASS',
      severity: 'info',
      finding: 'Security events are being logged with appropriate detail',
      reference: 'NIST SP 800-53 AU-2'
    });

    return issues;
  }

  /**
   * Analyze data exposure risk
   */
  analyzeDataExposure(incident, failedService) {
    const exposure = {
      risk: 'low',
      sensitiveDataTypes: [],
      exposureVectors: [],
      mitigationStatus: 'adequate'
    };

    if (failedService === 'PaymentService') {
      exposure.risk = 'medium';
      exposure.sensitiveDataTypes = [
        'Payment card data (PCI)',
        'Transaction details',
        'Customer financial information'
      ];
      exposure.exposureVectors = [
        'Error logs may contain transaction IDs',
        'Failed authentication attempts logged'
      ];
      exposure.mitigationStatus = 'needs-improvement';
      exposure.recommendations = [
        'Ensure payment card data is not logged',
        'Implement data masking in logs',
        'Review error message content for sensitive data'
      ];
    }

    // Check for secrets in logs
    const secretsInLogs = this.checkForSecretsInLogs(incident.logs);
    if (secretsInLogs.found) {
      exposure.risk = 'high';
      exposure.exposureVectors.push('Secrets detected in log files');
      exposure.secretsFound = secretsInLogs.types;
    }

    return exposure;
  }

  /**
   * Check for secrets in logs
   */
  checkForSecretsInLogs(logs) {
    const secretPatterns = {
      apiKey: /api[_-]?key/i,
      password: /password/i,
      token: /token.*[=:]\s*[a-zA-Z0-9]{20,}/i,
      secret: /secret/i
    };

    const found = false;
    const types = [];

    // In a real implementation, scan logs for patterns
    // For demo, we'll return no secrets found
    return { found, types };
  }

  /**
   * Generate security recommendations
   */
  generateSecurityRecommendations(severity, complianceIssues, dataExposure) {
    const recommendations = [];

    // Token management
    if (severity.level === 'high' && severity.description.includes('Authentication')) {
      recommendations.push({
        priority: 'critical',
        category: 'Authentication',
        title: 'Implement Secure Token Management',
        description: 'Deploy automatic token refresh and secure token storage',
        actions: [
          'Implement OAuth 2.0 refresh token flow',
          'Store tokens in secure vault (e.g., HashiCorp Vault)',
          'Add token expiration monitoring',
          'Implement token rotation policy'
        ],
        estimatedEffort: '3-5 days',
        complianceImpact: 'Addresses PCI DSS 8.2.4 and SOC 2 CC6.1'
      });
    }

    // Secrets management
    recommendations.push({
      priority: 'high',
      category: 'Secrets Management',
      title: 'Implement Secrets Management Solution',
      description: 'Move all secrets to a secure secrets management system',
      actions: [
        'Deploy HashiCorp Vault or AWS Secrets Manager',
        'Remove hardcoded credentials from configuration files',
        'Implement secret rotation policies',
        'Add secrets scanning to CI/CD pipeline'
      ],
      estimatedEffort: '1 week',
      complianceImpact: 'Critical for PCI DSS and SOC 2 compliance'
    });

    // Logging security
    recommendations.push({
      priority: 'medium',
      category: 'Logging',
      title: 'Enhance Security Logging',
      description: 'Improve security event logging and monitoring',
      actions: [
        'Implement centralized logging (ELK stack or similar)',
        'Add data masking for sensitive information',
        'Set up real-time security alerts',
        'Implement log retention policies'
      ],
      estimatedEffort: '1 week',
      complianceImpact: 'Supports SOC 2 and GDPR compliance'
    });

    // Compliance monitoring
    if (complianceIssues.some(issue => issue.status === 'FAIL')) {
      recommendations.push({
        priority: 'high',
        category: 'Compliance',
        title: 'Address Compliance Gaps',
        description: 'Remediate identified compliance issues',
        actions: [
          'Review and update security policies',
          'Implement automated compliance monitoring',
          'Schedule regular compliance audits',
          'Document remediation efforts'
        ],
        estimatedEffort: '2 weeks',
        complianceImpact: 'Required for PCI DSS, SOC 2, and GDPR'
      });
    }

    // Incident response
    recommendations.push({
      priority: 'medium',
      category: 'Incident Response',
      title: 'Enhance Incident Response Procedures',
      description: 'Improve security incident detection and response',
      actions: [
        'Document incident response playbooks',
        'Implement automated incident detection',
        'Set up security incident notification system',
        'Conduct regular incident response drills'
      ],
      estimatedEffort: '1-2 weeks',
      complianceImpact: 'Supports SOC 2 and GDPR requirements'
    });

    return recommendations;
  }

  /**
   * Calculate overall security score
   */
  calculateSecurityScore(severity, complianceIssues, dataExposure) {
    let score = 100;

    // Deduct for severity
    score -= severity.score * 5;

    // Deduct for compliance failures
    const failedCompliance = complianceIssues.filter(i => i.status === 'FAIL').length;
    score -= failedCompliance * 10;

    // Deduct for data exposure risk
    const riskDeduction = {
      'low': 0,
      'medium': 15,
      'high': 30,
      'critical': 50
    };
    score -= riskDeduction[dataExposure.risk] || 0;

    return Math.max(0, Math.min(100, score));
  }
}

module.exports = new SecurityAgent();

// Made with Bob
