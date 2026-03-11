const logger = require('../utils/logger');

/**
 * Architect Agent
 * Responsible for analyzing system dependencies and impact
 */
class ArchitectAgent {
  constructor() {
    this.name = 'ArchitectAgent';
    this.role = 'Architect';
  }

  /**
   * Analyze system architecture and dependencies
   */
  async analyze(incident, previousAnalysis) {
    logger.info(`${this.name}: Analyzing system architecture for incident ${incident.id}`);

    const { devAnalysis } = previousAnalysis;
    const failedService = devAnalysis.analysis.technicalDetails.service;

    // Identify impacted services
    const impactedServices = this.identifyImpactedServices(failedService);
    
    // Map dependencies
    const dependencies = this.mapDependencies(failedService);
    
    // Assess architectural impact
    const architecturalImpact = this.assessArchitecturalImpact(failedService, impactedServices);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(failedService, architecturalImpact);

    return {
      agent: this.name,
      impactedServices: impactedServices,
      dependencies: dependencies,
      architecturalImpact: architecturalImpact,
      recommendations: recommendations,
      confidence: 88,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Identify services impacted by the failure
   */
  identifyImpactedServices(failedService) {
    const serviceImpactMap = {
      'PaymentService': [
        {
          name: 'OrderService',
          impact: 'high',
          reason: 'Cannot complete order processing without payment confirmation',
          status: 'degraded'
        },
        {
          name: 'InvoiceService',
          impact: 'high',
          reason: 'Cannot generate invoices without payment data',
          status: 'blocked'
        },
        {
          name: 'NotificationService',
          impact: 'medium',
          reason: 'Cannot send payment confirmation emails',
          status: 'degraded'
        },
        {
          name: 'InventoryService',
          impact: 'medium',
          reason: 'Cannot release inventory without payment confirmation',
          status: 'degraded'
        }
      ],
      'OrderAPI': [
        {
          name: 'PaymentService',
          impact: 'critical',
          reason: 'No orders to process',
          status: 'idle'
        },
        {
          name: 'InventoryService',
          impact: 'high',
          reason: 'No inventory reservations',
          status: 'idle'
        }
      ],
      'Database': [
        {
          name: 'OrderService',
          impact: 'critical',
          reason: 'Cannot persist order data',
          status: 'blocked'
        },
        {
          name: 'PaymentService',
          impact: 'critical',
          reason: 'Cannot persist transaction data',
          status: 'blocked'
        },
        {
          name: 'ReportingService',
          impact: 'high',
          reason: 'Cannot access historical data',
          status: 'blocked'
        }
      ]
    };

    return serviceImpactMap[failedService] || [];
  }

  /**
   * Map service dependencies
   */
  mapDependencies(failedService) {
    const dependencyMap = {
      'PaymentService': {
        upstream: ['OrderService', 'Frontend'],
        downstream: ['AuthService', 'PaymentGateway', 'Database'],
        external: ['StripeAPI', 'PayPalAPI'],
        shared: ['LoggingService', 'MonitoringService']
      },
      'OrderAPI': {
        upstream: ['Frontend', 'MobileApp'],
        downstream: ['PaymentService', 'InventoryService', 'Database'],
        external: [],
        shared: ['LoggingService', 'MonitoringService']
      },
      'Database': {
        upstream: ['OrderService', 'PaymentService', 'UserService'],
        downstream: [],
        external: [],
        shared: ['BackupService', 'MonitoringService']
      }
    };

    const deps = dependencyMap[failedService] || {
      upstream: [],
      downstream: [],
      external: [],
      shared: []
    };

    return {
      ...deps,
      criticalPath: this.identifyCriticalPath(failedService),
      circuitBreakers: this.checkCircuitBreakers(failedService)
    };
  }

  /**
   * Identify critical path in the system
   */
  identifyCriticalPath(failedService) {
    if (failedService === 'PaymentService') {
      return [
        'Frontend',
        'OrderAPI',
        'PaymentService (FAILED)',
        'Database',
        'NotificationService'
      ];
    } else if (failedService === 'OrderAPI') {
      return [
        'Frontend',
        'OrderAPI (FAILED)',
        'PaymentService',
        'Database'
      ];
    }
    return [];
  }

  /**
   * Check circuit breaker status
   */
  checkCircuitBreakers(failedService) {
    return {
      implemented: false,
      recommendation: 'Implement circuit breaker pattern to prevent cascade failures',
      suggestedLibrary: 'opossum (Node.js circuit breaker)'
    };
  }

  /**
   * Assess architectural impact
   */
  assessArchitecturalImpact(failedService, impactedServices) {
    const highImpactCount = impactedServices.filter(s => s.impact === 'high' || s.impact === 'critical').length;
    
    let severity = 'low';
    let cascadeRisk = 'low';
    
    if (highImpactCount >= 3) {
      severity = 'critical';
      cascadeRisk = 'high';
    } else if (highImpactCount >= 2) {
      severity = 'high';
      cascadeRisk = 'medium';
    } else if (highImpactCount >= 1) {
      severity = 'medium';
      cascadeRisk = 'medium';
    }

    return {
      severity: severity,
      cascadeRisk: cascadeRisk,
      singlePointOfFailure: this.isSinglePointOfFailure(failedService),
      scalabilityImpact: this.assessScalabilityImpact(failedService),
      dataConsistency: this.assessDataConsistency(failedService)
    };
  }

  /**
   * Check if service is a single point of failure
   */
  isSinglePointOfFailure(failedService) {
    const criticalServices = ['PaymentService', 'Database', 'AuthService'];
    return {
      isSPOF: criticalServices.includes(failedService),
      reason: criticalServices.includes(failedService) 
        ? `${failedService} is critical to core business operations`
        : `${failedService} has redundancy or fallback mechanisms`
    };
  }

  /**
   * Assess scalability impact
   */
  assessScalabilityImpact(failedService) {
    return {
      currentLoad: 'medium',
      bottleneck: failedService === 'PaymentService' ? 'Authentication layer' : 'Unknown',
      horizontalScaling: 'possible',
      recommendation: 'Add load balancer and implement service mesh'
    };
  }

  /**
   * Assess data consistency
   */
  assessDataConsistency(failedService) {
    if (failedService === 'PaymentService') {
      return {
        risk: 'high',
        concern: 'Partial transactions may exist without payment confirmation',
        recommendation: 'Implement distributed transaction pattern (Saga) or event sourcing'
      };
    }
    return {
      risk: 'low',
      concern: 'No immediate data consistency issues detected'
    };
  }

  /**
   * Generate architectural recommendations
   */
  generateRecommendations(failedService, architecturalImpact) {
    const recommendations = [];

    // Circuit breaker recommendation
    recommendations.push({
      priority: 'high',
      category: 'Resilience',
      title: 'Implement Circuit Breaker Pattern',
      description: 'Add circuit breakers to prevent cascade failures',
      implementation: 'Use opossum library or similar',
      estimatedEffort: '2-3 days'
    });

    // Retry mechanism
    recommendations.push({
      priority: 'high',
      category: 'Resilience',
      title: 'Add Retry Logic with Exponential Backoff',
      description: 'Implement automatic retry for transient failures',
      implementation: 'Add retry middleware with exponential backoff',
      estimatedEffort: '1 day'
    });

    // Monitoring
    recommendations.push({
      priority: 'medium',
      category: 'Observability',
      title: 'Enhanced Monitoring and Alerting',
      description: 'Add service health checks and proactive alerting',
      implementation: 'Integrate with Prometheus/Grafana or similar',
      estimatedEffort: '3-4 days'
    });

    // Service mesh
    if (architecturalImpact.cascadeRisk === 'high') {
      recommendations.push({
        priority: 'medium',
        category: 'Architecture',
        title: 'Consider Service Mesh Implementation',
        description: 'Implement service mesh for better traffic management',
        implementation: 'Evaluate Istio or Linkerd',
        estimatedEffort: '2-3 weeks'
      });
    }

    // Authentication improvements
    if (failedService === 'PaymentService') {
      recommendations.push({
        priority: 'high',
        category: 'Security',
        title: 'Implement Token Refresh Mechanism',
        description: 'Add automatic OAuth token refresh to prevent expiration',
        implementation: 'Implement refresh token flow',
        estimatedEffort: '2-3 days'
      });
    }

    return recommendations;
  }
}

module.exports = new ArchitectAgent();

// Made with Bob
