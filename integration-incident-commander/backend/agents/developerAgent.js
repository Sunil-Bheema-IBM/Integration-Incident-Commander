const logger = require('../utils/logger');

/**
 * Developer Agent
 * Responsible for technical root cause analysis
 */
class DeveloperAgent {
  constructor() {
    this.name = 'DeveloperAgent';
    this.role = 'Developer';
  }

  /**
   * Analyze incident from technical perspective
   */
  async analyze(incident, previousAnalysis) {
    logger.info(`${this.name}: Performing technical analysis for incident ${incident.id}`);

    // Extract error information
    const errorLogs = incident.logs.filter(log => log.level === 'error');
    const errorDetails = errorLogs.length > 0 ? errorLogs[0] : null;

    if (!errorDetails) {
      return {
        agent: this.name,
        rootCause: 'Unable to determine root cause - no error logs found',
        confidence: 0
      };
    }

    // Analyze the error
    const analysis = this.analyzeError(errorDetails);
    
    // Identify root cause
    const rootCause = this.identifyRootCause(errorDetails, incident.logs);
    
    // Generate fix suggestion
    const suggestedFix = this.generateFixSuggestion(errorDetails, rootCause);

    return {
      agent: this.name,
      rootCause: rootCause.description,
      technicalDetails: {
        errorCode: errorDetails.metadata.errorCode,
        errorMessage: errorDetails.metadata.errorMessage,
        service: errorDetails.service,
        timestamp: errorDetails.timestamp,
        stackTrace: analysis.stackTrace
      },
      analysis: analysis,
      suggestedFix: suggestedFix,
      confidence: rootCause.confidence,
      estimatedFixTime: this.estimateFixTime(rootCause),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analyze error details
   */
  analyzeError(errorLog) {
    const errorCode = errorLog.metadata.errorCode;
    const errorMessage = errorLog.metadata.errorMessage;

    let analysis = {
      category: 'Unknown',
      severity: 'medium',
      stackTrace: null,
      possibleCauses: []
    };

    // Analyze based on error code
    if (errorCode === 401) {
      analysis = {
        category: 'Authentication',
        severity: 'high',
        stackTrace: 'at PaymentService.authenticate() [line 45]\nat PaymentService.processPayment() [line 120]',
        possibleCauses: [
          'Expired authentication token',
          'Invalid credentials',
          'Token refresh failure',
          'OAuth configuration issue'
        ]
      };
    } else if (errorCode === 403) {
      analysis = {
        category: 'Authorization',
        severity: 'high',
        possibleCauses: [
          'Insufficient permissions',
          'Role configuration error',
          'Access policy violation'
        ]
      };
    } else if (errorCode === 500) {
      analysis = {
        category: 'Server Error',
        severity: 'critical',
        possibleCauses: [
          'Unhandled exception',
          'Resource exhaustion',
          'Configuration error'
        ]
      };
    } else if (errorCode === 503) {
      analysis = {
        category: 'Service Unavailable',
        severity: 'critical',
        possibleCauses: [
          'Service down',
          'Dependency failure',
          'Resource limits exceeded'
        ]
      };
    }

    return analysis;
  }

  /**
   * Identify root cause
   */
  identifyRootCause(errorLog, allLogs) {
    const errorCode = errorLog.metadata.errorCode;
    const errorMessage = errorLog.metadata.errorMessage;
    const details = errorLog.metadata.details;

    let rootCause = {
      description: 'Unknown error',
      confidence: 50,
      category: 'Unknown'
    };

    // Pattern matching for common issues
    if (errorCode === 401 && errorMessage.includes('token expired')) {
      rootCause = {
        description: 'OAuth authentication token has expired. The token was issued 24 hours ago and exceeded its maximum lifetime of 1 hour.',
        confidence: 95,
        category: 'Authentication',
        technicalCause: 'Token expiration not handled properly. No token refresh mechanism implemented.',
        codeLocation: 'PaymentService.authenticate() method',
        affectedComponent: 'OAuth token manager'
      };
    } else if (errorCode === 401) {
      rootCause = {
        description: 'Authentication failure in Payment Service',
        confidence: 85,
        category: 'Authentication'
      };
    } else if (errorCode === 500) {
      rootCause = {
        description: 'Internal server error in Payment Service',
        confidence: 70,
        category: 'Server Error'
      };
    }

    return rootCause;
  }

  /**
   * Generate fix suggestion
   */
  generateFixSuggestion(errorLog, rootCause) {
    const errorCode = errorLog.metadata.errorCode;

    let suggestion = {
      immediate: [],
      shortTerm: [],
      longTerm: []
    };

    if (errorCode === 401 && rootCause.category === 'Authentication') {
      suggestion = {
        immediate: [
          'Manually refresh the OAuth token in the configuration',
          'Restart the Payment Service to pick up new token',
          'Verify token endpoint is accessible'
        ],
        shortTerm: [
          'Implement automatic token refresh mechanism',
          'Add token expiration monitoring',
          'Set up alerts for authentication failures'
        ],
        longTerm: [
          'Implement OAuth 2.0 refresh token flow',
          'Add circuit breaker pattern for auth service',
          'Implement token caching with proper TTL',
          'Add comprehensive authentication logging'
        ],
        codeChanges: [
          {
            file: 'services/PaymentService.js',
            change: 'Add token refresh logic before API calls',
            priority: 'high'
          },
          {
            file: 'config/oauth.config.js',
            change: 'Update token lifetime configuration',
            priority: 'medium'
          }
        ]
      };
    }

    return suggestion;
  }

  /**
   * Estimate fix time
   */
  estimateFixTime(rootCause) {
    const confidenceLevel = rootCause.confidence;
    
    if (confidenceLevel >= 90) {
      return '2-4 hours';
    } else if (confidenceLevel >= 70) {
      return '4-8 hours';
    } else {
      return '1-2 days';
    }
  }
}

module.exports = new DeveloperAgent();

// Made with Bob
