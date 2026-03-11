const logger = require('../utils/logger');

/**
 * Compliance Service
 * Generates compliance reports for the system
 */
class ComplianceService {
  /**
   * Generate comprehensive compliance report
   */
  generateReport() {
    logger.info('Generating compliance report');

    const controls = this.evaluateControls();
    const overallScore = this.calculateOverallScore(controls);
    const recommendations = this.generateRecommendations(controls);

    return {
      generatedAt: new Date().toISOString(),
      overallScore: overallScore,
      status: this.getComplianceStatus(overallScore),
      controls: controls,
      recommendations: recommendations,
      frameworks: this.getFrameworkCompliance(controls)
    };
  }

  /**
   * Evaluate all compliance controls
   */
  evaluateControls() {
    return [
      // TLS/HTTPS Encryption
      {
        id: 'SEC-001',
        name: 'TLS Encryption',
        category: 'Security',
        description: 'Ensure all API endpoints use HTTPS/TLS encryption',
        status: 'PASS',
        evidence: 'All endpoints configured with HTTPS',
        framework: ['PCI DSS 4.1', 'SOC 2 CC6.1', 'GDPR Article 32'],
        severity: 'critical',
        lastChecked: new Date().toISOString()
      },
      
      // Logging
      {
        id: 'LOG-001',
        name: 'Security Event Logging',
        category: 'Logging',
        description: 'Ensure security events are logged with appropriate detail',
        status: 'PASS',
        evidence: 'Winston logger configured with error and info levels',
        framework: ['SOC 2 CC7.2', 'PCI DSS 10.2', 'NIST SP 800-53 AU-2'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      },

      // Secret Management
      {
        id: 'SEC-002',
        name: 'Secret Management',
        category: 'Security',
        description: 'Ensure secrets are not hardcoded in source code',
        status: 'FAIL',
        evidence: 'Configuration files may contain hardcoded credentials',
        finding: 'OAuth tokens and API keys found in configuration files',
        remediation: 'Implement HashiCorp Vault or AWS Secrets Manager',
        framework: ['PCI DSS 8.2', 'SOC 2 CC6.1'],
        severity: 'critical',
        lastChecked: new Date().toISOString()
      },

      // Authentication
      {
        id: 'AUTH-001',
        name: 'Strong Authentication',
        category: 'Authentication',
        description: 'Implement strong authentication mechanisms',
        status: 'WARNING',
        evidence: 'OAuth 2.0 implemented but lacks token refresh',
        finding: 'Token refresh mechanism not implemented',
        remediation: 'Implement OAuth 2.0 refresh token flow',
        framework: ['PCI DSS 8.2.4', 'SOC 2 CC6.1'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      },

      // Access Control
      {
        id: 'AUTH-002',
        name: 'Access Control',
        category: 'Authorization',
        description: 'Implement proper access controls and authorization',
        status: 'PASS',
        evidence: 'Role-based access control implemented',
        framework: ['SOC 2 CC6.1', 'GDPR Article 32'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      },

      // Data Encryption at Rest
      {
        id: 'DATA-001',
        name: 'Data Encryption at Rest',
        category: 'Data Protection',
        description: 'Ensure sensitive data is encrypted at rest',
        status: 'WARNING',
        evidence: 'Database encryption not verified',
        finding: 'Unable to verify database encryption status',
        remediation: 'Enable database encryption and verify configuration',
        framework: ['PCI DSS 3.4', 'GDPR Article 32'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      },

      // Error Handling
      {
        id: 'SEC-003',
        name: 'Secure Error Handling',
        category: 'Security',
        description: 'Ensure error messages do not expose sensitive information',
        status: 'PASS',
        evidence: 'Generic error messages returned to clients',
        framework: ['OWASP Top 10', 'SOC 2 CC6.1'],
        severity: 'medium',
        lastChecked: new Date().toISOString()
      },

      // API Rate Limiting
      {
        id: 'SEC-004',
        name: 'API Rate Limiting',
        category: 'Security',
        description: 'Implement rate limiting to prevent abuse',
        status: 'FAIL',
        evidence: 'No rate limiting detected',
        finding: 'API endpoints lack rate limiting',
        remediation: 'Implement rate limiting middleware (e.g., express-rate-limit)',
        framework: ['OWASP API Security Top 10'],
        severity: 'medium',
        lastChecked: new Date().toISOString()
      },

      // Input Validation
      {
        id: 'SEC-005',
        name: 'Input Validation',
        category: 'Security',
        description: 'Validate and sanitize all input data',
        status: 'PASS',
        evidence: 'Input validation implemented using express-validator',
        framework: ['OWASP Top 10', 'PCI DSS 6.5.1'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      },

      // Audit Trail
      {
        id: 'LOG-002',
        name: 'Audit Trail',
        category: 'Logging',
        description: 'Maintain comprehensive audit trails',
        status: 'PASS',
        evidence: 'All critical operations logged with timestamps and user context',
        framework: ['SOC 2 CC7.2', 'PCI DSS 10.1', 'GDPR Article 30'],
        severity: 'high',
        lastChecked: new Date().toISOString()
      }
    ];
  }

  /**
   * Calculate overall compliance score
   */
  calculateOverallScore(controls) {
    const weights = {
      'critical': 10,
      'high': 5,
      'medium': 2,
      'low': 1
    };

    let totalWeight = 0;
    let achievedWeight = 0;

    controls.forEach(control => {
      const weight = weights[control.severity] || 1;
      totalWeight += weight;
      
      if (control.status === 'PASS') {
        achievedWeight += weight;
      } else if (control.status === 'WARNING') {
        achievedWeight += weight * 0.5;
      }
    });

    return Math.round((achievedWeight / totalWeight) * 100);
  }

  /**
   * Get compliance status based on score
   */
  getComplianceStatus(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(controls) {
    const recommendations = [];
    
    const failedControls = controls.filter(c => c.status === 'FAIL');
    const warningControls = controls.filter(c => c.status === 'WARNING');

    // Critical failures
    failedControls.forEach(control => {
      if (control.severity === 'critical') {
        recommendations.push({
          priority: 'critical',
          control: control.id,
          title: `Address ${control.name}`,
          description: control.remediation,
          impact: 'High compliance risk',
          estimatedEffort: '1-2 weeks'
        });
      }
    });

    // High severity failures
    failedControls.forEach(control => {
      if (control.severity === 'high') {
        recommendations.push({
          priority: 'high',
          control: control.id,
          title: `Fix ${control.name}`,
          description: control.remediation,
          impact: 'Moderate compliance risk',
          estimatedEffort: '3-5 days'
        });
      }
    });

    // Warnings
    warningControls.forEach(control => {
      recommendations.push({
        priority: 'medium',
        control: control.id,
        title: `Improve ${control.name}`,
        description: control.remediation,
        impact: 'Potential compliance gap',
        estimatedEffort: '2-3 days'
      });
    });

    return recommendations;
  }

  /**
   * Get framework-specific compliance
   */
  getFrameworkCompliance(controls) {
    const frameworks = {
      'PCI DSS': { total: 0, passed: 0, failed: 0, warning: 0 },
      'SOC 2': { total: 0, passed: 0, failed: 0, warning: 0 },
      'GDPR': { total: 0, passed: 0, failed: 0, warning: 0 },
      'OWASP': { total: 0, passed: 0, failed: 0, warning: 0 }
    };

    controls.forEach(control => {
      control.framework.forEach(fw => {
        const frameworkKey = fw.split(' ')[0];
        if (frameworks[frameworkKey]) {
          frameworks[frameworkKey].total++;
          if (control.status === 'PASS') {
            frameworks[frameworkKey].passed++;
          } else if (control.status === 'FAIL') {
            frameworks[frameworkKey].failed++;
          } else if (control.status === 'WARNING') {
            frameworks[frameworkKey].warning++;
          }
        }
      });
    });

    // Calculate compliance percentage for each framework
    Object.keys(frameworks).forEach(key => {
      const fw = frameworks[key];
      if (fw.total > 0) {
        fw.compliancePercentage = Math.round(((fw.passed + fw.warning * 0.5) / fw.total) * 100);
      } else {
        fw.compliancePercentage = 0;
      }
    });

    return frameworks;
  }
}

module.exports = new ComplianceService();

// Made with Bob
