const logger = require('../utils/logger');

/**
 * Product Owner Agent
 * Responsible for understanding the incident and defining investigation scope
 */
class ProductOwnerAgent {
  constructor() {
    this.name = 'ProductOwnerAgent';
    this.role = 'Product Owner';
  }

  /**
   * Analyze incident from business perspective
   */
  async analyze(incident, previousAnalysis) {
    logger.info(`${this.name}: Analyzing incident ${incident.id}`);

    // Extract error information from logs
    const errorLogs = incident.logs.filter(log => log.level === 'error');
    const failedService = errorLogs.length > 0 ? errorLogs[0].service : 'Unknown';
    
    // Analyze business impact
    const businessImpact = this.assessBusinessImpact(incident, errorLogs);
    
    // Define investigation scope
    const scope = this.defineScope(incident, errorLogs);

    return {
      agent: this.name,
      summary: `Integration failure detected in ${failedService}. ${businessImpact.description}`,
      businessImpact: businessImpact,
      investigationScope: scope,
      priority: businessImpact.priority,
      affectedFeatures: this.identifyAffectedFeatures(failedService),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Assess business impact
   */
  assessBusinessImpact(incident, errorLogs) {
    const failedService = errorLogs.length > 0 ? errorLogs[0].service : 'Unknown';
    
    let impact = {
      description: '',
      severity: 'medium',
      priority: 'P3',
      customerFacing: false
    };

    if (failedService === 'PaymentService') {
      impact = {
        description: 'Payment processing is blocked. Customers cannot complete purchases.',
        severity: 'high',
        priority: 'P1',
        customerFacing: true,
        estimatedRevenueLoss: '$5,000/hour'
      };
    } else if (failedService === 'OrderAPI') {
      impact = {
        description: 'Order creation is failing. New orders cannot be placed.',
        severity: 'critical',
        priority: 'P1',
        customerFacing: true,
        estimatedRevenueLoss: '$10,000/hour'
      };
    } else if (failedService === 'Database') {
      impact = {
        description: 'Data persistence failure. Transactions may be lost.',
        severity: 'critical',
        priority: 'P1',
        customerFacing: true
      };
    }

    return impact;
  }

  /**
   * Define investigation scope
   */
  defineScope(incident, errorLogs) {
    return {
      focusAreas: [
        'Authentication and authorization',
        'Service connectivity',
        'Configuration validation',
        'Dependency health'
      ],
      excludedAreas: [
        'Frontend UI issues',
        'Network infrastructure'
      ],
      timeframe: 'Last 24 hours',
      relatedSystems: ['OrderAPI', 'PaymentService', 'Database', 'AuthService']
    };
  }

  /**
   * Identify affected features
   */
  identifyAffectedFeatures(failedService) {
    const featureMap = {
      'PaymentService': [
        'Payment processing',
        'Order completion',
        'Invoice generation',
        'Refund processing'
      ],
      'OrderAPI': [
        'Order creation',
        'Order tracking',
        'Inventory updates'
      ],
      'Database': [
        'Data persistence',
        'Transaction logging',
        'Audit trails'
      ]
    };

    return featureMap[failedService] || ['Unknown features'];
  }
}

module.exports = new ProductOwnerAgent();

// Made with Bob
